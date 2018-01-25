import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from 'react-spinkit';
import {addError, removeError, startRequest, endRequest, stopCallToService} from './actions';
import {getServiceError, serviceIsLoading, serviceThrowError, shouldCallService} from './selectors';
import {VelocityTransitionGroup} from 'velocity-react';

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

const ServiceCallerHOC = (WrappedComponent, options = {overlaySpinner: false}) => {
    class ServiceCallerClass extends Component {

        render() {
            //TODO: filter props, don't use this.props
            return (options.overlaySpinner) ? this.renderOverlaySpinner() : this.renderSpinnerInsteadContent();
        }

        renderSpinnerInsteadContent = () => {
            return (this.props.isLoading) ?
                <Spinner style={styles.spinner} name="circle" noFadeIn/> :
                <WrappedComponent {...this.props} service={this.injectProps()} />
        };

        renderOverlaySpinner = () => {
            let component = null;

            if (this.props.isLoading) {
                component = (
                    <div style={styles.spinnerContainer}>
                        <Spinner style={styles.spinner} name="cube-grid" noFadeIn/>
                    </div>
                )
            }

            return (
                <div>
                    <WrappedComponent {...this.props} service={this.injectProps()} />
                    <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}} runOnMount>
                        {component}
                    </VelocityTransitionGroup>
                </div>
            );
        };

        componentWillMount() {
            //TODO: check for data?
        }

        componentWillUnmount() {
            this.props.removeError();
        }

        injectProps() {
            return {
                addError: this.props.addError,
                endRequest: this.props.endRequest,
                error: this.props.error,
                hasError: this.props.serviceThrowError,
                removeError: this.props.removeError,
                renderOverlaySpinner: this.renderOverlaySpinner,
                startRequest: this.props.startRequest,
                makeRequest: this.makeRequest,
            }
        }

        //TODO:Create a function to map errors keys to messages
        makeRequest = (promiseApiCall, data) => {
            this.props.startRequest();

            return new Promise((resolve) => {
                promiseApiCall(data)
                    .then(resp => {
                        this.props.endRequest();
                        resolve(resp);
                    })
                    .catch(err => {
                        this.props.endRequest();
                        this.props.addError(err);
                    })
            });
        }
    }

    ServiceCallerClass.propTypes = {
        addError: PropTypes.func,
        shouldCallService: PropTypes.bool,
        endRequest: PropTypes.func,
        removeError: PropTypes.func,
        startRequest: PropTypes.func,
        stopCallToService: PropTypes.func,
    };

    const mapStateToProps = (state) => {
        return {
            error: getServiceError(state),
            isLoading: serviceIsLoading(state),
            serviceThrowError: serviceThrowError(state),
            shouldCallService: shouldCallService(state),
        }
    };

    const mapDispatchToProps = (dispatch) => {
        return bindActionCreators({
            addError,
            endRequest,
            removeError,
            startRequest,
            stopCallToService,
        }, dispatch)
    };

    return connect(mapStateToProps, mapDispatchToProps)(ServiceCallerClass);
};

export default ServiceCallerHOC;