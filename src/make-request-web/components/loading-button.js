import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import withServiceIsLoading from '../../common/hocs/withServiceIsLoading';
import Spinner from 'react-spinkit';

const styles = {
    mainContainer: {
        position: 'relative',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

class LoadingButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: (props.isLoading !== undefined) ? props.isLoading : props.serviceIsLoading,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isLoading, serviceIsLoading} = nextProps;

        if (isLoading !== this.props.isLoading || serviceIsLoading !== this.props.serviceIsLoading) {
            let loadingState;

            if (isLoading !== undefined) {
                loadingState = isLoading;
            } else {
                loadingState = serviceIsLoading;
            }

            this.setState({isLoading: loadingState});
        }
    }

    render() {
        const {
            children,
            classes,
            spinnerName,
            spinnerColor,
            spinnerComponent,
            overlayBackgroundColor,
            spinkitProps,
        } = this.props;
        const {isLoading} = this.state;

        return (
            <div className={classes.mainContainer}>
                    { (isLoading)
                        ? <div className={classes.loadingContainer} style={{backgroundColor: overlayBackgroundColor, zIndex: (isLoading) ? 999 : 0}}>
                            {(spinnerComponent)
                                ? spinnerComponent
                                : <Spinner
                                    name={spinnerName}
                                    fadeIn="none"
                                    color={spinnerColor}
                                    {...spinkitProps}
                                />
                            }
                        </div>
                        : null
                    }
                {children}
            </div>
        );
    }
}

LoadingButton.defaultProps = {
    spinnerName: 'circle',
    spinnerColor: '#000',
    overlayBackgroundColor: '#bdb9b27a',
    spinkitProps: {},
};

LoadingButton.propTypes = {
    spinnerName: PropTypes.string,
    spinnerColor: PropTypes.string,
    spinnerComponent: PropTypes.node,
    spinkitProps: PropTypes.object,
    overlayBackgroundColor: PropTypes.string,
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
};

export default compose(
    withServiceIsLoading(),
    withStyles(styles),
)(LoadingButton);