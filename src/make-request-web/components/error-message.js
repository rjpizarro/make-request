import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import {red} from '@material-ui/core/colors'
import { compose, mapProps } from 'recompose';
import withMakeRequestProps from '../../common/hocs/withMakeRequestProps';
import scrollToComponent from 'react-scroll-to-component';
import Transition from 'react-transition-group/Transition';

const duration = 350;
const red500 = red[500];
const styles = {
    animatedDiv: {
        transition: `opacity ${duration}ms`,
        opacity: 0,
    },
    container: {
        backgroundColor: red500,
        padding: 15,
        marginBottom: 20,
        color: '#FFF',
    },
    titleContainer: {
        display: 'flex',
    },
    title: {
        marginLeft: 5,
    },
    closeIcon: {
        textAlign: 'right',
    },
    textColor: {
        color: '#FFF',
    },
    textBold: {
        fontWeight: 'bold',
    },
};
const animationStyles = {
    entering: {
        opacity: 0,
    },
    entered: {
        opacity: 1,
    },
    exited: {
        opacity: 0,
    }
};

class ErrorMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: props.showError,
        };

        this.componentRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showError !== this.state.showError) {
            this.setState({showError: nextProps.showError})
        }
    }

    componentDidUpdate() {
        if (this.state.showError) {
            this.scrollToError();
        }
    };

    render() {
        const {classes} = this.props;
        const {showError} = this.state;

        return (
            <div ref={this.componentRef}>
                 <Transition in={showError} timeout={{enter: 0, exit: duration}} onExited={this.onErrorTransitionComplete} unmountOnExit>
                    { state => (
                        <div className={classes.animatedDiv} style={animationStyles[state]}>
                                {this.renderError()}
                            </div>

                        )
                    }
                </Transition>
            </div>
        );
    }

    renderError = () => {
        const {
            title,
            body,
            code,
            classes,
            bodyExtraLine,
            showError,
        } = this.props;

        return (
            <Paper className={classes.container}>
                <Grid container spacing={0} justify="space-around">
                    <Grid item xs={12} lg={11} className={classes.titleContainer}>
                        {(showError) ? <ErrorIcon /> : null}
                        {(showError)
                            ? <Typography variant="title" className={[classes.title, classes.textColor]}>{title}</Typography>
                            : null
                        }
                    </Grid>
                    <Grid item xs={12} lg={1} className={[classes.closeIcon]}>
                        <IconButton onClick={this.dismissError} className={classes.textColor}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    {(body) ?
                        <Grid item xs={12}>
                            <Typography className={classes.textColor}>{body}</Typography>
                            <Typography className={[classes.textColor, classes.textBold]}>{bodyExtraLine}</Typography>
                        </Grid> :
                        null
                    }
                    {(code) ?
                        <Grid item xs={12}>
                            <Typography variant="caption" align="right" className={classes.textColor}>Code: {code}</Typography>
                        </Grid> :
                        null
                    }
                </Grid>
            </Paper>
        )
    };

    dismissError = () => {
        this.setState({
            showError: false,
        })
    };

    onErrorTransitionComplete = () => {
        this.props.removeError();
    };

    scrollToError = () => {
        const domNode = ReactDOM.findDOMNode(this.componentRef.current);

        scrollToComponent(domNode, {
            offset: -15,
            align: 'top',
            duration: 500
        });
    }
}

ErrorMessage.defaultProps = {
    title: 'Something went wrong',
    scrollAnimationOptions: {
        offset: -15,
        align: 'top',
        duration: 500
    }
};

ErrorMessage.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.node,
    bodyExtraLine: PropTypes.node,
    code: PropTypes.string,
    showError: PropTypes.bool,
    removeError: PropTypes.func,
    scrollAnimationOptions: PropTypes.object
};

export default compose(
    withMakeRequestProps,
    mapProps(props => ({
        showError: props.serviceThrowError,
        title: props.serviceError &&  props.serviceError.title,
        body: props.serviceError &&  props.serviceError.body,
        code: props.serviceError &&  props.serviceError.code,
        removeError: props.removeError,
    })),
    withStyles(styles),
)(ErrorMessage);