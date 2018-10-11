import React from 'react';
import PropTypes  from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shouldShowSuccessMessage, getSuccessMessage} from '../../common/selectors';
import {hideSuccessMessage} from '../../common/actions';
import Snackbar from '@material-ui/core/Snackbar';

let SuccessSnackBar = (props) => {
    return <Snackbar
        open={props.successApiCall}
        message={props.successMessage}
        autoHideDuration={4000}
        onClose={props.hideSuccessMessage}
        contentStyle={{color: '#FFF'}}
    />;
};

SuccessSnackBar.defaultProps = {
    successMessage: 'Action Completed Successfully'
};

SuccessSnackBar.propTypes = {
    successApiCall: PropTypes.bool,
    successMessage: PropTypes.string,
    hideSuccessMessage: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        successMessage: getSuccessMessage(state),
        successApiCall: shouldShowSuccessMessage(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        hideSuccessMessage
    }, dispatch)
};

SuccessSnackBar = connect(mapStateToProps, mapDispatchToProps)(SuccessSnackBar);
export default SuccessSnackBar;