declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Request {
    user: import('@/modules/auth/types').BasicUserInfo;
  }
}
