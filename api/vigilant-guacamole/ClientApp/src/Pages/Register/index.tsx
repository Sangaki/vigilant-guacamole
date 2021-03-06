﻿import React, { ChangeEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { throws } from 'assert';
import { RootStateI } from '../../store';
import { RegisterStateI } from './reducers';
import { RegisterDispatch } from './actions';
import { EmailErrors, PasswordConfirmErrors, PasswordErrors } from '../../shared/enums/errors';
import { validateEmail } from '../../shared/validators/forms';
import './index.scss';

const getRegisterState = (state: RootStateI): RegisterStateI => {
  return state.register;
};

export const Register: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const registerState = useSelector(getRegisterState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailErrors, setEmailErrors] = useState('');
  const [passwordErrors, setPasswordErrors] = useState('');
  const [passwordConfirmErrors, setPasswordConfirmErrors] = useState('');
    
  const initRegister = useCallback(() => {
    async function sendData() {
      if (!validateEmail(email)) {
        setEmailErrors(EmailErrors.notExist);
        throw new Error(EmailErrors.notExist);
      }
      if (password.length < 6) {
        setPasswordErrors(PasswordErrors.length);
        throw new Error(PasswordErrors.numbers);
      }
      if (password.toLowerCase() === password || password.toLowerCase() === password) {
        setPasswordErrors(PasswordErrors.capital);
        throw new Error(PasswordErrors.capital);
      }
      if (!password.match('[0-9]+')) {
        setPasswordErrors(PasswordErrors.numbers);
        throw new Error(PasswordErrors.numbers);
      }
      if (!password.match('(?=.*[!@#$%^&*])')) {
        setPasswordErrors(PasswordErrors.specials);
        throw new Error(PasswordErrors.specials);
      }
      if (password.match(' ')) {
        setPasswordErrors(PasswordErrors.space);
        throw new Error(PasswordErrors.space);
      }
      if (confirmPassword !== password) {
        setPasswordConfirmErrors(PasswordConfirmErrors.notMatch);
        throw new Error(PasswordConfirmErrors.notMatch);
      }

      await dispatch(RegisterDispatch({ email, password }));
    }
        
    sendData().then(() => {
      if (!registerState.loading && !registerState.error) {
        history.push({
          pathname: '/login',
        });
      } 
    }).catch(e => throws(e));
  }, [email, password, confirmPassword, dispatch, registerState, history]);
    
  return (
    <div className="row no-gutters auth-page__wrapper">
      <div className="col-12 col-md-5 d-none d-lg-block auth-page__left-block">
        <img src="/images/logo.png" alt="JustDo" className="logo" />
      </div>
      <div className="col-12 col-lg-7 auth-page__right-block">
        <div className="auth-page__register-form-wrapper">
          <h3 className="auth-page__header">Sign Up</h3>
          <Form onSubmit={initRegister} className="auth-page__register-form">
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                onChange={
                                    (event: ChangeEvent<HTMLInputElement>) => { 
                                      setEmail(event.target.value);
                                      setEmailErrors('');
                                    }
                                }
              />
              <span className="form-error">{emailErrors}</span>
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={
                                    (event: ChangeEvent<HTMLInputElement>) => { 
                                      setPassword(event.target.value);
                                      setPasswordErrors('');
                                    }
                                }
              />
              <span className="form-error">{passwordErrors}</span>
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm Password"
                onChange={
                                    (event: ChangeEvent<HTMLInputElement>) => { 
                                      setConfirmPassword(event.target.value);
                                      setPasswordErrors('');
                                    }
                                }
              />
              <span className="form-error">{passwordConfirmErrors}</span>
            </FormGroup>
            <FormGroup>
              <a href="/" className="auth-page__forgot-link">Forgot password?</a>
            </FormGroup>
            <FormGroup>
              <Button onClick={initRegister}>Sign Up</Button>
            </FormGroup>
            <FormGroup>
              <span>I already have an account. 
                <span 
                  className="span-link" 
                  onClick={() => history.push('/login')}
                  onKeyDown={() => {}}
                  tabIndex={0}
                  role="button"
                >
                  Sign In
                </span>
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