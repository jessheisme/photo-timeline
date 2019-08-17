import Cookies from 'js-cookie';
import queryString from 'query-string';
import config from '../config';

export const redirectToLogin = () => {
  const redirectQuery = queryString.stringify({
    auth_callback: `${window.location.origin}/auth/callback`,
  });
  window.location.assign(`${config.accountsURL}?${redirectQuery}`)
}

export const setAuthCookies = (userId, token, refreshToken) => {
  const opts = {
    expires: 365,
    domain: config.domain,
  };

  Cookies.set(config.authUserKey, userId, opts);
  Cookies.set(config.authTokenKey, token, opts);
  Cookies.set(config.authRefreshTokenKey, refreshToken, opts);
}

export const removeAuthCookies = () => {
  Cookies.remove(config.authTokenKey, { domain: config.domain });
  Cookies.remove(config.authTokenKey, { domain: config.domain });
  Cookies.remove(config.authRefreshTokenKey, { domain: config.domain });
}