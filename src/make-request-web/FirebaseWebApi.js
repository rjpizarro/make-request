import firebase from 'firebase/app';
import 'firebase/storage';
import _get from 'lodash/get';

const errorMapper = (firebaseError, lang = 'en') => {
    const {code, message} = firebaseError;
    const titleByErrorType = {
        auth: (lang === 'en') ? 'Authentication Error' : 'Error de autenticación',
        storage: (lang === 'en') ? 'Storage Error' : 'Error en el servicio de Storage',
    };
    const matchPrefixCode = /([a-z]*(?=\/))/;
    const codePrefix = matchPrefixCode.exec(code) && matchPrefixCode.exec(code)[0];
    const title = _get(titleByErrorType, codePrefix);

    return {
        title: (title) ? title : (lang === 'en') ? 'Oops! Something went wrong.' : 'Error en la aplicación.',
        body: (message) ? message : '',
        code: code,
        errorResponse: firebaseError,
        raw: firebaseError,
    }
};

export default class FirebaseApi {
    constructor(firebaseConfig, options = { lang: 'en'}) {
        this.app = firebase.initializeApp(firebaseConfig);
        this.storageRef = firebase.storage().ref();
        this.lang = options.lang || 'en';
    }

    getApp = () => this.app;

    getStorageRef = () => this.storageRef;

    /**
     *
     * @param {string} endpoint
     * @return {function(*)}
     */
    upload = (endpoint) => {
        /**
         * @param {object} data
         * @param {array} data.params
         * @param {*} data.file
         * @param {object} data.options
         * @param {function} data.options.onProgress
         * @param {function} data.options.onError
         * @param {function} data.options.onComplete
         * @param {function} data.options.onPause
         * @param {function} data.options.onCancel
         * @param {object} data.options.metadata
         * @param {function} data.options.getUploadTask
         * @return {Promise}
         */
        return (data) => {
            return new Promise((resolve, reject) => {
                let uploadTask;
                const {params, file, options} = data;
                const {
                    onProgress,
                    onError,
                    onComplete,
                    metadata,
                    getUploadTask,
                    onCancel,
                    onPause,
                } = options;

                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) : endpoint;

                try {
                    uploadTask = this.storageRef.child(completeEndpoint).put(file, metadata);
                } catch (e) {
                    reject(errorMapper(e, this.lang))
                }

                if (getUploadTask) getUploadTask(uploadTask);

                uploadTask.on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {
                            if (onProgress) onProgress(snapshot, this._getSnapshotUploadPercentage(snapshot));

                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    if (onPause) onPause(snapshot);
                                    break;
                                case firebase.storage.TaskState.CANCELED:
                                    if (onCancel) onCancel(snapshot);
                                    break;
                            }
                        },
                        (err) => {
                            const error = errorMapper(err, this.lang);

                            if (onError) onError(error);

                            // Prevent make request handle a cancel action as an Service Error.
                            // You still could handle as an error with onError callback.
                            if (error.code === 'storage/canceled') {
                                resolve(error);
                            } else {
                                reject(error)
                            }
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                if (onComplete) onComplete(downloadURL);

                                resolve(downloadURL);
                            });
                        }
                    );
            })
        };
    };

    /**
     *
     * @param {string} endpoint
     * @param {Array} params
     * @return {string}
     * @private
     */
    _getEndpointWithRouteParams = (endpoint, params = []) => `${endpoint}/${params.join('/')}`;

    /**
     *
     * @param {object} snapshot
     * @return {string}
     * @private
     */
    _getSnapshotUploadPercentage = (snapshot) => snapshot.bytesTransferred / snapshot.totalBytes * 100;

}
