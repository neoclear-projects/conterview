import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { getCookie } from '../util/get-cookie';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            getCookie("username") === '' ?
                <Redirect to="/login" />
            : <Component {...props} />
        )} />
    );
};

export default PrivateRoute;