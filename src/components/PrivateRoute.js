import Cookies from 'js-cookie';
import React from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, redirectTo, isLoading, loggedIn, ...rest }) => {
    const location = useLocation();
    const token = Cookies.get("token");
    return (
        <Route {...rest}
            render={(props) =>
                !!token
                    ? <Component {...props} />
                    : <Redirect to={redirectTo}
                        state={
                            { from: location.pathname }
                        }
                    />
            }
        />
    )

}
export default PrivateRoute
