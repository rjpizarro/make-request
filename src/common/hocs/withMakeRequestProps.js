import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, setPropTypes } from 'recompose';
import {
    removeError,
    hideSuccessMessage,
    showSuccessMessage,
    addError,
} from '../actions';
import {
    getServiceError,
    serviceThrowError,
    serviceIsLoading,
    shouldShowSuccessMessage,
    getSuccessMessage,
    getIsLoadingData,
} from '../selectors';

const mapStateToProps = (state) => {
    return {
        serviceError: getServiceError(state),
        serviceThrowError: serviceThrowError(state),
        serviceIsLoading: serviceIsLoading(state),
        shouldShowSuccessMessage: shouldShowSuccessMessage(state),
        successMessage: getSuccessMessage(state),
        loadingData: getIsLoadingData(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        removeError,
        hideSuccessMessage,
        showSuccessMessage,
        addError,
    }, dispatch)
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    setPropTypes({
        serviceError: PropTypes.object,
        serviceThrowError: PropTypes.bool,
        serviceIsLoading: PropTypes.bool,
        shouldShowSuccessMessage: PropTypes.bool,
        successMessage: PropTypes.string,
        loadingData: PropTypes.object,
        removeError: PropTypes.func,
        hideSuccessMessage: PropTypes.func,
        showSuccessMessage: PropTypes.func,
        addError: PropTypes.func,
    }),
);