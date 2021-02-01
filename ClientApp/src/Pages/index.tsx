import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useSelector } from 'react-redux';
import { Tasks } from './Tasks';
import { Login } from './Login';
import { RootStateI } from '../store';
import { Register } from './Register';
import { LoginResponseI } from '../api/auth';

const loginSelector = (store: RootStateI): LoginResponseI => store.login;

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
