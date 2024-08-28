import cookie from "cookie";
import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { UserAuthData } from "@core/domain/Auth/Auth.types";

export function netBearerTokenInterceptor(config: AxiosRequestConfig) {
  let newHeaders: AxiosRequestHeaders = {
    ...config.headers,
  };

  const userCookie = cookie.parse(document.cookie);

  if (userCookie.user) {
    const user: UserAuthData = JSON.parse(userCookie.user);

    if (user.token) {
      newHeaders = { ...newHeaders, Authorization: `Bearer ${user.token}` };
    }
  }

  config.headers = newHeaders || {};

  return config;
}
