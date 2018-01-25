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
                    };
                } else if (error.request) {
                    errorData = {
                        title: 'Connection Error',
                        body: 'The application cannot connect to the server.',
                        code: 500,
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
        return function () {
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
        return function (data) {
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
        return function (data) {
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
        return function (data) {
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
        return function (data) {
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
    private _getEndpointWithRouteId = (endpoint, id) => `${endpoint}/${id}`;

    /**
     *
     * @param {string} endpoint
     * @param {Array} params
     * @return {string}
     * @private
     */
    private _getEndpointWithRouteParams = (endpoint, params = []) => `${endpoint}/${params.join('/')}`;

}