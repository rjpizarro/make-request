import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Route,
    Redirect,
} from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...routeProps, redirectTo, isAuthenticated }) => {

    return (
        <Route
            {...routeProps}
            render={ props => (
                (isAuthenticated) ?
                    <Component {...props} {...routeProps} /> :
                    <Redirect to={{pathname: redirectTo }}/>
            )}
        />
    );
};

PrivateRoute.propTypes = {
    redirectTo: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};


export default PrivateRoute