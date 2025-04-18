import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type IAuthState = IAuthIdle | AuthSuccess;
interface IAuthIdle {
  status: "authIdle";
}
const authIdle: IAuthIdle = {
  status: "authIdle",
};
class AuthSuccess {
  status = "authSuccess" as const;
  authToken: string;
  constructor(authToken: string) {
    this.authToken = authToken;
  }
}

interface ILogActions {
  logIn: (authToken: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<IAuthState & Partial<ILogActions>>(authIdle);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<IAuthState>(authIdle);
  const router = useRouter();

  const logIn = (authToken: string) => {
    router.replace("/");
    setAuthState(new AuthSuccess(authToken));
  };

  const logOut = () => {
    router.replace("/login");
    setAuthState(authIdle);
  };

  return (
    <AuthContext.Provider value={{ ...authState, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useCheckedAuthContext = (): IAuthState & ILogActions => {
  const authState = useContext(AuthContext);

  if (!authState || !authState.logIn || !authState.logOut) {
    throw new Error("Error: AuthContext is used where it is not provided");
  }

  return authState as IAuthState & ILogActions;
};

export { useCheckedAuthContext, AuthProvider };
