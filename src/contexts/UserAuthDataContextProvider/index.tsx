import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { isEmpty } from "lodash";

import { UserAuthData } from "@core/domain/Auth/Auth.types";

interface LoggedUserContextType {
  user?: UserAuthData;
  setUser?: (user: UserAuthData) => void;
}

export const LoggedUserContext = React.createContext<LoggedUserContextType>({});

interface LoggedUserContextProviderProps {
  children: ReactNode;
}

function LoggedUserContextProvider({
  children,
}: LoggedUserContextProviderProps) {
  const [userCookie] = useCookies(["user"]);

  const [user, setUser] = useState<UserAuthData>();

  useEffect(() => {
    if (!isEmpty(userCookie)) {
      setUser(userCookie.user as UserAuthData);
    }
  }, [userCookie]);

  return (
    <LoggedUserContext.Provider value={{ user, setUser }}>
      {children}
    </LoggedUserContext.Provider>
  );
}

export function useLoggedUser() {
  const { user, setUser } = useContext(LoggedUserContext);

  return { user, setUser };
}

export default LoggedUserContextProvider;
