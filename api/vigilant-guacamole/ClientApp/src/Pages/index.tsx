import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useSelector } from 'react-redux';
import { RootStateI } from 'src/store';
import { Tasks } from './Tasks';
import { Login } from './Login';
import { Register } from './Register';

const loginSelector = (store: RootStateI): string => store.login.token;

export function AppRouter() {
  const loginState = useSelector(loginSelector);

  return (
    <div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/" exact>
          {!loginState ? <Redirect to="/login" /> : <Tasks />}
        </Route>
      </Switch>
    </div>
  );
}
