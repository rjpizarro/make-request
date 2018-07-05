import axios from 'axios';
import mimeTypes from './mime-types';
import _isArrayBuffer from 'lodash/isArrayBuffer';
import ab2str from 'arraybuffer-to-string';

const _getMessageFromArrayBufferError = (data) => {
    try {
        const jsonResponse = JSON.parse(ab2str(data));

        return jsonResponse.message;
    } catch (err) {
        return err
    }
};

export default class Api {
    constructor(baseUrl, {timeout = 30000, headers = {}, lang = 'en', errorInterceptor}) {
        this.apiInstance = axios.create({
            baseURL: baseUrl,
            timeout: timeout,
            headers: {...headers}
        });

        if (errorInterceptor && typeof errorInterceptor === 'function') {
            this.apiInstance.interceptors.response.use(
                (response) => response.data,
                errorInterceptor
            )
        } else {
            this.apiInstance.interceptors.response.use(
                (response) => response.data,
                (error) => {
                    let errorData;
                    const language = (lang) ? lang : 'en';

                    if (error.response) {
                        const data = error.response.data;
                        const status = data.status;
                        const code = data.code || error.response.status || 400;
                        //Error from download files is converted to an ArrayBuffer. Transform to string for response
                        const title = _isArrayBuffer(data) ? _getMessageFromArrayBufferError(data) : data.message;
                        const message = data.response || data.message;


                        errorData = {
                            title: (title) ? title : (language === 'en') ? 'Oops! Something went wrong.' : 'Error en la aplicación.',
                            body: (message) ? message : '',
                            code: `${status}-${code}`,
                            errorResponse: error.response,
                            raw: error,
                        };
                    } else if (error.request) {
                        errorData = {
                            title: (language === 'en') ? 'Connection Error' : 'Error de conexión',
                            body: (language === 'en') ? 'The application cannot connect to the server.' : 'La aplicación no puede conectarse con el servidor.',
                            code: 500,
                            raw: error,
                        }
                    }

                    return Promise.reject(errorData);
                }
            );
        }
    }

    /**
     *
     * @param {string} token
     */
    updateAuthKey = (token) => {
        this.apiInstance.defaults.headers['Authorization'] = `${token}`;
    };

    /**
     *
     * @param {string} endpoint
     * @returns {Function}
     */
    get = (endpoint) => {
        return () => {
            return new Promise((resolve, reject) => {

                this.apiInstance.get(endpoint)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    };

    /**
     *
     * @param endpoint
     * @param {object} options
     * @param {*} options.onResponse
     * @param {object} data
     * @param {string} data.id
     * @param {Array} data.params
     * @return {Function}
     */
    getWithRouteParams = (
        endpoint,
        options = {
            onResponse: () => {}
        },
        data = {
            id: '',
            params: []
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {id, params} = data;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) :
                    this._getEndpointWithRouteId(endpoint, id);

                this.apiInstance.get(completeEndpoint)
                    .then((response) => {
                        if (options.onResponse) options.onResponse(response, data);

                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    };

    /**
     *
     * @param endpoint
     * @param downloadFileName
     * @param {object} options
     * @param {*} options.beforeSend
     * @param {*} options.onResponse
     * @param {String} options.fileType
     * @param {String} options.method
     * @param {object} data
     * @param {string} data.id
     * @param {Array} data.params
     * @param {object} data.body
     * @return {Function}
     */
    getFile = (
        endpoint,
        downloadFileName,
        options = {
            beforeSend: d => d,
            onResponse: () => {},
            fileType: 'pdf',
            method: 'GET',
        },
        data = {
            id: '',
            body: {},
            params: [],
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {id, params, body} = data;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) :
                    this._getEndpointWithRouteId(endpoint, id);

                if (options.method === 'GET') {
                    this.apiInstance.get(completeEndpoint, {responseType: 'arraybuffer'})
                        .then((response) => this._onGetFileResponse(response, data, downloadFileName, resolve, options))
                        .catch(reject)
                } else {
                    const request = (options.beforeSend) ? options.beforeSend(body) : body;
                    this.apiInstance.post(completeEndpoint, request, {responseType: 'arraybuffer'})
                        .then((response) => this._onGetFileResponse(response, data, downloadFileName, resolve, options))
                        .catch(reject)
                }
            })
        }
    };

    /**
     *
     * @param {string} endpoint
     * @param {object} data
     * @param {object} data.body
     * @param {Array} data.params
     * @param {object} [options]
     * @param {*} [options.beforeSend]
     * @param {*} [options.onResponse]
     * @returns {Function}
     */
    post = (
        endpoint,
        options = {
            beforeSend: d => d,
            onResponse: () => {}
        },
        data = {
            body: {},
            params: []
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {body, params} = data;
                const request = (options.beforeSend) ? options.beforeSend(body) : body;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) : endpoint;

                this.apiInstance.post(completeEndpoint, request)
                    .then((response) => {
                        if (options.onResponse) options.onResponse(response, data);

                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    };

    /**
     *
     * @param {string} endpoint
     * @param {object} [options]
     * @param {*} [options.beforeSend]
     * @param {*} [options.onResponse]
     * @param {object} data
     * @param {string} data.id
     * @param {object} data.body
     * @param {Array} data.params
     * @return {Function}
     */
    put = (
        endpoint,
        options = {
            beforeSend: d => d,
            onResponse: () => {}
        },
        data = {
            id: '',
            body: {},
            params: []
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {id, body, params} = data;
                const request = (options.beforeSend) ? options.beforeSend(body) : body;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) :
                    this._getEndpointWithRouteId(endpoint, id);

                this.apiInstance.put(completeEndpoint, request)
                    .then((response) => {
                        if (options.onResponse) options.onResponse(response, data);

                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    };

    /**
     *
     * @param {string} endpoint
     * @param {object} [options]
     * @param {*} [options.onResponse]
     * @param {object} data
     * @param {string} data.id
     * @param {Array} data.params
     * @return {Function}
     */
    delete_ = (
        endpoint,
        options = {
            onResponse: () => {}
        },
        data = {
            id: '',
            params: []
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {id, params} = data;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) :
                    this._getEndpointWithRouteId(endpoint, id);

                this.apiInstance.delete(completeEndpoint)
                    .then((response) => {
                        if (options.onResponse) options.onResponse(response, data);

                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    };

    /**
     *
     * @param response
     * @param data
     * @param downloadFileName
     * @param resolve
     * @param options
     * @private
     */
     _onGetFileResponse = (response, data, downloadFileName, resolve, options) => {
        if (options.onResponse) options.onResponse(response, data);

        resolve(response);

        let blob = new Blob([response], {type: mimeTypes[options.fileType]});
        let link = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.href = url;
        link.download = downloadFileName;
        link.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 0);
    };

    /**
     *
     * @param endpoint
     * @param id
     * @return {string}
     * @private
     */
    _getEndpointWithRouteId = (endpoint, id) => (id) ? `${endpoint}/${id}` : endpoint;

    /**
     *
     * @param {string} endpoint
     * @param {Array} params
     * @return {string}
     * @private
     */
    _getEndpointWithRouteParams = (endpoint, params = []) => `${endpoint}/${params.join('/')}`;

}
