import dotProp from 'dot-prop-immutable';
import _get from 'lodash/get';
import {
    ADD_ERROR,
    REMOVE_ERROR,
    START_LOADING,
    FINISH_LOADING,
    SHOW_SUCCESS_MESSAGE,
    HIDE_SUCCESS_MESSAGE,
} from './actionTypes'

const initialState = {
    isLoading: {},
    serviceError: {},
    showSuccessMessage: false,
    successMessage: '',
    promiseQueueCount: 0,
};

export default (state = initialState, action) => {
    const {type} = action;

    if (type === ADD_ERROR) {
        return Object.assign(
            {},
            state,
            {serviceError: action.error}
        );
    }

    if (type === REMOVE_ERROR) {
        return Object.assign(
            {},
            state,
            {serviceError: {}}
        );
    }

    if (type === START_LOADING) {
        const {
            silent,
            customRequestType,
        } = action;
        const {promiseQueueCount} = state;
        const nextCount = (silent) ? promiseQueueCount : promiseQueueCount + 1;

        state = dotProp.set(state, 'promiseQueueCount', nextCount);

        if (customRequestType) {
            const customLoadingCount = _get(state, `loading.${customRequestType}`, 0);

            state = dotProp.set(state, `loading.${customRequestType}`, customLoadingCount + 1);
        }
    }

    if (type === FINISH_LOADING) {
        const {
            silent,
            customRequestType,
        } = action;
        const {promiseQueueCount} = state;
        const nextCount = (silent) ? promiseQueueCount : promiseQueueCount - 1;

        state = dotProp.set(state, 'promiseQueueCount', nextCount);

        if (customRequestType) {
            const customLoadingCount = _get(state, `loading.${customRequestType}`);

            state = dotProp.set(state, `loading.${customRequestType}`, customLoadingCount - 1);
        }
    }

    if (type === SHOW_SUCCESS_MESSAGE) {
        return Object.assign(
            {},
            state,
            {
                showSuccessMessage: true,
                successMessage: action.message,
            }
        );
    }

    if (type === HIDE_SUCCESS_MESSAGE) {
        return Object.assign(
            {},
            state,
            {
                showSuccessMessage: false,
                successMessage: '',
            }
        );
    }

    return state;
}
