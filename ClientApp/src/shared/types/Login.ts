export interface LoginI {
  email: string,
  password: string,
}

export interface RegisterI extends LoginI {}

export interface TokenDtoI {
  token: string,
}

export interface JsonWebTokenI {
  accessToken: string,
  refreshToken: string,
  expires: Date,
}
