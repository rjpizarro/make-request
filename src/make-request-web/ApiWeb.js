import Api from '../common/Api';

export default class ApiWeb extends Api {
    constructor(baseUrl, {timeout = 30000, headers = {}, lang = 'en', errorInterceptor}) {
        super(baseUrl, {
            timeout: timeout,
            headers: headers,
            lang: lang,
            errorInterceptor: errorInterceptor
        })
    }

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
                    super._getEndpointWithRouteParams(endpoint, params) :
                    super._getEndpointWithRouteId(endpoint, id);

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
     * @param url
     * @param fileName
     * @param {object} options
     * @param {String} options.fileType
     * @return {Function}
     */
    downloadFile = (url, fileName, options = {}) => {
        return () => {

            return new Promise((resolve, reject) => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                        const blob = xhr.response;
                        this._onGetFileResponse(xhr.response, {}, fileName, resolve, options)
                    };
                    xhr.onabort = () => {
                        reject("Transaction aborted!")
                    };
                    xhr.onerror = (err) => {
                        reject(err)
                    };
                    xhr.open('GET', url);
                    xhr.send();
                } catch(err) {
                    reject(err)
                }
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
}
