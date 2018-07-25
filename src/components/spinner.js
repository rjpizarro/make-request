import React from 'react';
import PropTypes  from 'prop-types';
import {connect} from 'react-redux';
import {serviceIsLoading} from '../selectors';
import Spinner from 'react-spinkit';

const styles = {
    spinnerContainer: {
        backgroundColor: 'rgba(31, 31, 31, 0.95)',
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 999,
    },
    spinner: {
        color: '#FFF',
        height: 75,
        left: '50%',
        marginLeft: -37,
        marginTop: -37,
        position: 'absolute',
        top: '50%',
        width: 75,
    },
};

let AppSpinner = (props) => {

    return (
            (props.isLoading || props.forceLoading) ?
                <div style={styles.spinnerContainer}>
                    <Spinner style={styles.spinner} spinnerName="cube-grid" noFadeIn/>
                </div> :
                null

    );
};

AppSpinner.defaultProps = {
    forceLoading: false
};

AppSpinner.propTypes = {
    isLoading: PropTypes.bool,
    forceLoading: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        isLoading: serviceIsLoading(state),
    }
};

AppSpinner = connect(mapStateToProps)(AppSpinner);
export default AppSpinner;