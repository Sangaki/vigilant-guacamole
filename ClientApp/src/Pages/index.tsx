import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useSelector } from 'react-redux';
import { TokenDtoI } from 'src/shared/types/Login';
import { RootStateI } from 'src/store';
import { Tasks } from './Tasks';
import { Login } from './Login';
import { Register } from './Register';

const loginSelector = (store: RootStateI): TokenDtoI => store.login;

export function AppRouter() {
  const loginState = useSelector(loginSelector);
  const loggedIn = loginState.token;

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
