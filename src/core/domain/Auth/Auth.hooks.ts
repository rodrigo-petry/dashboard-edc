import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";

import { authenticate } from "./Auth.service";
import { AuthRequest, AuthResponse, UserAuthData } from "./Auth.types";

export const useAuthenticate = () => {
  const [cookie, setCookie] = useCookies(["user"]);

  const mutation = useMutation(authenticate, {
    onSuccess: (res: AuthResponse, variables: AuthRequest) => {
      const data: UserAuthData = {
        id: res.id,
        token: res.token,
        email: variables.email,
      };

      setCookie("user", data, {
        path: "/",
        maxAge: 604800, // 7 dias
        sameSite: true,
      });
    },
  });

  return mutation;
};

export const useLogout = () => {
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);

  const logout = () => {
    removeCookie("user");

    router.push("/login");
  };

  return logout;
};
