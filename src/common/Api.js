import axios from 'axios';
import mimeTypes from './mime-types';
import _isArrayBuffer from 'lodash/isArrayBuffer';
import _isEmpty from 'lodash/isEmpty';
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
     * @param {Object} data.query
     * @return {Function}
     */
    getWithRouteParams = (
        endpoint,
        options = {
            onResponse: () => {}
        },
        data = {
            id: '',
            params: [],
            query: {}
        }) => {
        return (data) => {
            return new Promise((resolve, reject) => {
                const {id, params, query} = data;
                let completeEndpoint;

                if (params && params.length) {
                    completeEndpoint = Api.getEndpointWithRouteParams(endpoint, params)
                } else {
                    completeEndpoint = Api.getEndpointWithRouteId(endpoint, id);
                }

                if (!_isEmpty(query)) {
                    completeEndpoint = Api.getEndpointWithQueryParams(completeEndpoint, query)
                }

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
                    Api.getEndpointWithRouteParams(endpoint, params) : endpoint;

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
                    Api.getEndpointWithRouteParams(endpoint, params) :
                    Api.getEndpointWithRouteId(endpoint, id);

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
                    Api.getEndpointWithRouteParams(endpoint, params) :
                    Api.getEndpointWithRouteId(endpoint, id);

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
     */
    static getEndpointWithRouteId = (endpoint, id) => (id) ? `${endpoint}/${id}` : endpoint;

    /**
     *
     * @param {string} endpoint
     * @param {Array} params
     * @return {string}
     */
    static getEndpointWithRouteParams = (endpoint, params = []) => `${endpoint}/${params.join('/')}`;


    /**
     *
     * @param {string} endpoint
     * @param {Object} query
     * @return {string}
     */
    static getEndpointWithQueryParams = (endpoint, query = {}) =>
        `${endpoint}?${Object.keys(query).map(k => `${k}=${query[k]}`).join('&')}`;
}
