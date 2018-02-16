import normalizers from './normalizers';
import {startRequest, endRequest, addError} from './actions';

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
 * @param {string} [options.startRequestActionType]
 * @param {string} [options.endRequestActionType]
 * @return Promise
 */
export default function makeRequest(
    promiseCall,
    data = {id: '', body: {}, params: []},
    dispatch,
    options = {
        beforeNormalize: () => {},
        shouldNormalize: false,
        useMongoNormalizer: false,
        startRequestActionType: undefined,
        endRequestActionType: undefined,
    }
) {
        dispatch(startRequest(options.startRequestActionType));
        let normalizer;

        if (options.normalizer) {
            normalizer = options.normalizer
        } else {
            normalizer = (options.useMongoNormalizer) ? normalizers.mongoArrayNormalize : normalizers.arrayNormalize;
        }

        return new Promise((resolve, reject) => {
            try {
                promiseCall(data)
                    .then(resp => {
                        dispatch(endRequest(options.endRequestActionType));
                        let payload = resp;

                        if (options.shouldNormalize) {
                            payload = (options.beforeNormalize) ? options.beforeNormalize(resp) : resp;
                            payload = normalizer(payload);
                        }

                        resolve(payload)
                    })
                    .catch(err => {
                        dispatch(endRequest(options.endRequestActionType));
                        dispatch(addError(err));
                        reject(err)
                    })

            } catch (err) {
                dispatch(endRequest(options.endRequestActionType));
                dispatch(addError({
                    title: 'Internal Error',
                    code: 500,
                }));

                reject(err);
            }
        })
    }