import React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Tasks} from "./Tasks";
import {Login} from "./Login";
import {RootStateI} from "../store";
import {LoginStateI} from "./Login/reducers";
import {useSelector} from "react-redux";
import {Register} from "./Register";

const getLoginState = (state: RootStateI): LoginStateI => {
    return state.login;
};

export function AppRouter() {
    const loginState = useSelector(getLoginState);
    const loggedIn = loginState.content.token;
    if (loggedIn) {
        console.log('user logged in with token');
    } else {
        console.log('user not logged in');
    }

    return (
        <div>
            <Switch>
                <Route path="/login">
                    {loggedIn ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/register">
                    {loggedIn ? <Redirect to="/" /> : <Register />}
                </Route>
                <Route path="/" exact>
                    {!loggedIn ? <Redirect to="/login" /> : <Tasks />}
                </Route>
            </Switch>
        </div>
);
}