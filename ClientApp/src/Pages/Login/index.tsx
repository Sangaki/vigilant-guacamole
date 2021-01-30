import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { RootStateI } from '../../store';
import { LoginStateI } from './reducers';
import { LoginDispatch } from './actions';
import './index.scss';

const getLoginState = (state: RootStateI): LoginStateI => {
  return state.login;
};

export const Login: React.FunctionComponent<{}> = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loginState = useSelector(getLoginState);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [credentialsError, setCredentialsError] = useState(false);
    
  const initLogin = useCallback(() => {
    dispatch(LoginDispatch({ email: login, password }));
  }, [login, password, dispatch]);
    
  useEffect(() => {
    setCredentialsError(loginState.error);
  }, [loginState.error, setCredentialsError]);
    
  return (
    <div className="row no-gutters auth-page__wrapper">
      <div className="col-12 col-md-5 d-none d-lg-block auth-page__left-block">
        <img src="/images/logo.png" alt="JustDo" className="logo" />
      </div>
      <div className="col-12 col-lg-7 auth-page__right-block">
        <div className="auth-page__login-form-wrapper">
          <h3 className="auth-page__header">Sign In</h3>
          <Form onSubmit={initLogin} className="auth-page__login-form">
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setLogin(event.target.value); }}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value); }}
              />
            </FormGroup>
            <FormGroup>
              <span className="span-link auth-page__forgot-link">Forgot password?</span>
            </FormGroup>
            <FormGroup>
              <Button onClick={initLogin}>Sign In</Button>
            </FormGroup>
            <FormGroup className={!credentialsError ? 'hidden credential-error' : 'credential-error'}>
              <span>Wrong email or password. Please check credentials and try again</span>
            </FormGroup>
            <FormGroup>
              <span
                className="span-link"
                onClick={() => {
                  setCredentialsError(false);
                  history.push('/register');
                }}
                role="button"
                onKeyDown={() => {}}
                tabIndex={0}
              >Sign Up
              </span>
            </FormGroup>
          </Form>
        </div>
        <div className="auth-page__disclaimer">
          <p>
            By accessing your account, you agree to our <br />
            <a href="/">Terms conditions</a> and <a href="/">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};