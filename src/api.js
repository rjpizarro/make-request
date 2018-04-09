import axios from 'axios';

export default class Api {
    constructor(baseUrl, {timeout = 30000, headers = {}}) {
        this.apiInstance = axios.create({
            baseURL: baseUrl,
            timeout: timeout,
            headers: {...headers}
        });

        this.apiInstance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                let errorData;

                if (error.response) {
                    const code = error.response.status;

                    errorData = {
                        title: 'Oops! Something went wrong.',
                        body: (code === 400 || code === 404 || code === 401) ? 'Username and password don\'t match' : '',
                        code: code,
                        errorResponse: error.response,
                        raw: error,
                    };
                } else if (error.request) {
                    errorData = {
                        title: 'Connection Error',
                        body: 'The application cannot connect to the server.',
                        code: 500,
                        raw: error,
                    }
                }

                return Promise.reject(errorData);
            }
        );
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
     * @param {object} data
     * @param {string} data.id
     * @param {Array} data.params
     * @return {Function}
     */
    getFile = (
        endpoint,
        downloadFileName,
        options = {
            beforeSend: d => d,
            onResponse: () => {},
            fileType: 'pdf'
        },
        data = {
            id: '',
            params: []
        }) => {
        return (data) => {
            const mimeByFileType = {
                pdf: 'application/pdf',
                xls: 'application/vnd.ms-excel',
            };

            return new Promise((resolve, reject) => {
                const {id, params} = data;
                const completeEndpoint = (params && params.length) ?
                    this._getEndpointWithRouteParams(endpoint, params) :
                    this._getEndpointWithRouteId(endpoint, id);

                this.apiInstance.get(completeEndpoint, {responseType: 'arraybuffer'})
                    .then((response) => {
                        if (options.onResponse) options.onResponse(response, data);

                        resolve(response);

                        let blob = new Blob([response], {type: mimeByFileType[options.fileType]});
                        let link = document.createElement('a');
                        let url = window.URL.createObjectURL(blob);
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = downloadFileName;
                        link.click();

                        setTimeout(() => {
                            window.URL.revokeObjectURL(url);
                        }, 0);
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
