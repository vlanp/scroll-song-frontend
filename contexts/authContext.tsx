import { SplashScreen, useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IAuthState = IAuthLoading | IAuthIdle | AuthSuccess;
interface IAuthIdle {
  status: "authIdle";
}
const authIdle: IAuthIdle = {
  status: "authIdle",
};
interface IAuthLoading {
  status: "authLoading";
}
const authLoading: IAuthLoading = {
  status: "authLoading",
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

const AuthContext = createContext<IAuthState & Partial<ILogActions>>(
  authLoading
);

const authStorageKey = "authKey";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<IAuthState>(authLoading);
  const router = useRouter();

  const logIn = (authToken: string) => {
    const authState = new AuthSuccess(authToken);
    storeAuthState(authState);
    setAuthState(authState);
    router.replace("/");
  };

  const logOut = () => {
    storeAuthState(authIdle);
    setAuthState(authIdle);
    router.replace("/login");
  };

  const storeAuthState = async (authState: IAuthState) => {
    try {
      const jsonValue = JSON.stringify(authState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving authToken into async storage", error);
    }
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const authState: IAuthState = JSON.parse(value);
          setAuthState(authState);
        } else {
          setAuthState(authIdle);
        }
      } catch (error) {
        console.log("Error fetching authState from async storage", error);
        setAuthState(authIdle);
      }
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (authState.status !== "authLoading") {
      SplashScreen.hideAsync();
    }
  }, [authState]);

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

const useSuccessfulAuthContext = (): AuthSuccess & ILogActions => {
  const authState = useCheckedAuthContext();

  if (authState.status !== "authSuccess") {
    throw new Error("Error: AuthContext should have a successful status");
  }

  return authState as AuthSuccess & ILogActions;
};

export { useCheckedAuthContext, AuthProvider, useSuccessfulAuthContext };
