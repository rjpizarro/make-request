import {NAME} from './constants';
import _ from 'lodash';

export const getServiceError = state => state[NAME].serviceError;
export const shouldCallService = state => state[NAME].shouldCallService;
export const serviceThrowError = state => !_.isEmpty(state[NAME].serviceError);
export const serviceIsLoading = state => state[NAME].isLoading;
export const shouldShowSuccessMessage = state => state[NAME].showSuccessMessage;
export const getSuccessMessage = state => state[NAME].successMessage;