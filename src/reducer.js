import {
    ADD_ERROR,
    REMOVE_ERROR,
    START_LOADING,
    FINISH_LOADING,
    SHOW_SUCCESS_MESSAGE,
    HIDE_SUCCESS_MESSAGE,
} from './actionTypes'

const initialState = {
    isLoading: false,
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
        return Object.assign(
            {},
            state,
            {
                isLoading: true,
                promiseQueueCount: state.promiseQueueCount + 1,
            }
        );
    }

    if (type === FINISH_LOADING) {
        return Object.assign(
            {},
            state,
            {
                isLoading: false,
                promiseQueueCount: state.promiseQueueCount - 1,
            }
        );
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
