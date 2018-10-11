import {NAME} from './constants';
import _ from 'lodash';

export const getServiceError = state => state[NAME].serviceError;
export const serviceThrowError = state => !_.isEmpty(state[NAME].serviceError);
export const serviceIsLoading = state => state[NAME].promiseQueueCount > 0;
export const shouldShowSuccessMessage = state => state[NAME].showSuccessMessage;
export const getSuccessMessage = state => state[NAME].successMessage;
export const getIsLoadingData = state => state[NAME].isLoading;