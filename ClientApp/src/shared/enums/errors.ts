﻿export enum PasswordErrors {
    'capital' = 'The password must contain at least one upper and lower case letters',
    'numbers' = 'The password must contain one or more numbers',
    'space' = 'The password should not contain spaces',
    'symbol' = 'The password must contain one or more numbers',
}

export enum PasswordConfirmErrors {
    'notMatch' = 'Password do not match',
}