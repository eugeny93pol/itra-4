import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {LoginPage} from "./pages/LoginPage";
import {RegistrationPage} from "./pages/RegistrationPage";
import {UsersPage} from "./pages/UsersPage";

export const useRoutes = isAuth => {
    if (isAuth) {
        return (
            <Switch>
                <Route path="/" exact>
                    <UsersPage/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/login" exact>
                <LoginPage />
            </Route>
            <Route path="/registration" exact>
                <RegistrationPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}

