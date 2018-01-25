import {
    ADD_ERROR,
    REMOVE_ERROR,
    START_LOADING,
    FINISH_LOADING,
    STOP_CALL,
    SHOW_SUCCESS_MESSAGE,
    HIDE_SUCCESS_MESSAGE,
} from './actionTypes'

export function addError(error) {
    return {
        type: ADD_ERROR,
        error: error,
    };
}

export function removeError() {
    return {
        type: REMOVE_ERROR,
    };
}

export function startRequest(ACTION_TYPE = START_LOADING) {
    return {
        type: ACTION_TYPE,
    };
}

export function endRequest(ACTION_TYPE = FINISH_LOADING) {
    return {
        type: ACTION_TYPE,
    };
}

export function stopCallToService() {
    return {
        type: STOP_CALL,
    };
}

export function showSuccessMessage(message) {
    return {
        type: SHOW_SUCCESS_MESSAGE,
        message: message,
    };
}

export function hideSuccessMessage() {
    return {
        type: HIDE_SUCCESS_MESSAGE,
    };
}