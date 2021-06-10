import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useUser } from '../context/UserContext';

const PrivateRoute = ({ component: Component, redirectTo, type, ...rest }) => {
    let showComponent;
    const { user } = useUser();

    switch (type) {
        case 'user':
            showComponent = !!user;
            break;

        default:
            break;
    }

    return (
        <Route {...rest} render={props => {
            return (
                showComponent
                    ? <Component {...props} />
                    : <Redirect to={redirectTo} />
            )
        }}
        />
    )
}

export default PrivateRoute
