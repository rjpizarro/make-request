import normalizers from './normalizers';
import {startRequest, endRequest, addError, removeError} from './actions';

/**
 *
 * @param {function} promiseCall
 * @param {object} data
 * @param {string} [data.id]
 * @param {object} [data.body]
 * @param {object} [data.params]
 * @param {function} dispatch
 * @param {object} options
 * @param {function} [options.beforeNormalize]
 * @param {function} [options.normalizer]
 * @param {boolean} [options.shouldNormalize]
 * @param {boolean} [options.useMongoNormalizer]
 * @param {string} [options.customRequestType]
 * @param {string} [options.startRequestActionType]
 * @param {string} [options.endRequestActionType]
 * @param {string} [options.silent]
 * @param {object} [options.mockResponse]
 * @return Promise
 */
export default function makeRequest(
    promiseCall,
    data = {id: '', body: {}, params: [], options: {}},
    dispatch,
    options = {}
) {
        let normalizer;

        if (options.beforeNormalize === undefined) {options.beforeNormalize = null}
        if (options.normalizer === undefined) {options.normalizer = null}
        if (options.useMongoNormalizer === undefined) {options.useMongoNormalizer = false}
        if (options.shouldNormalize === undefined) {options.shouldNormalize = false}
        if (options.silent === undefined) {options.silent = false}
        if (options.mockResponse === undefined) {options.mockResponse = null}

        dispatch(startRequest(options.startRequestActionType, options.silent, options.customRequestType));
        dispatch(removeError());

        if (options.normalizer) {
            normalizer = options.normalizer
        } else {
            normalizer = (options.useMongoNormalizer) ? normalizers.mongoArrayNormalize : normalizers.arrayNormalize;
        }

        return new Promise((resolve, reject) => {
            if (!options.mockResponse) {
                try {
                    promiseCall(data)
                        .then(resp => {
                            dispatch(endRequest(options.endRequestActionType, options.silent, options.customRequestType));
                            let payload = resp;

                            if (options.shouldNormalize) {
                                payload = (options.beforeNormalize) ? options.beforeNormalize(resp) : resp;
                                payload = normalizer(payload);
                            }

                            resolve(payload)
                        })
                        .catch(err => {
                            dispatch(endRequest(options.endRequestActionType, options.silent, options.customRequestType));
                            dispatch(addError(err));
                            reject(err)
                        })

                } catch (err) {
                    dispatch(endRequest(options.endRequestActionType, options.silent, options.customRequestType));
                    dispatch(addError({
                        title: 'Internal Error',
                        code: 500,
                    }));

                    reject(err);
                }
            } else {
                //simulate request
                const delay = Math.random() * (3000 - 250) + 250;

                setTimeout(() => {
                    dispatch(endRequest(options.endRequestActionType, options.silent, options.customRequestType));
                    let payload = options.mockResponse;

                    if (options.shouldNormalize) {
                        payload = (options.beforeNormalize) ? options.beforeNormalize(payload) : payload;
                        payload = normalizer(payload);
                    }

                    resolve(payload)
                }, delay)
            }
        })
    }