﻿export enum PasswordErrors {
  'capital' = 'The password must contain at least one upper and lower case letters',
  'numbers' = 'The password must contain one or more numbers',
  'space' = 'The password should not contain spaces',
  'specials' = 'The password should contain at least one special character (@,!,?,.,:,; etc.)',
  'symbol' = 'The password must contain one or more numbers',
  'length' = 'The password must be at least 6 characters',
}

export enum PasswordConfirmErrors {
  'notMatch' = 'Password do not match',
}

export enum EmailErrors {
  'notExist' = 'This address does not exist',
}

export enum TaskErrors {
  'emptyHeader' = "Task header shouldn't be empty",
}