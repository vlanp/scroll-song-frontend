import { createContext, PropsWithChildren, useContext } from "react";

interface IEnv {
  [key: string]: string | undefined;
  apiUrl: string | undefined;
  devApiUrl: string | undefined;
  discoverEndpoint: string | undefined;
  likeEndpoint: string | undefined;
  dislikeEndpoint: string | undefined;
  genresEndpoint: string | undefined;
  excerptDirectory: string | undefined;
  loginEndpoint: string | undefined;
  signupEndpoint: string | undefined;
  mailCheckEndpoint: string | undefined;
  askResetPwEndpoint: string | undefined;
  resetPwEndpoint: string | undefined;
  updatedGenresEndpoint: string | undefined;
}

interface ICheckedEnv {
  apiUrl: string;
  devApiUrl: string;
  discoverEndpoint: string;
  likeEndpoint: string;
  dislikeEndpoint: string;
  genresEndpoint: string;
  excerptDirectory: string;
  loginEndpoint: string;
  signupEndpoint: string;
  mailCheckEndpoint: string;
  askResetPwEndpoint: string;
  resetPwEndpoint: string;
  updatedGenresEndpoint: string;
}

const EnvContext = createContext<IEnv | null>(null);

const EnvProvider = ({ children }: PropsWithChildren) => {
  const env: IEnv = {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    devApiUrl: process.env.EXPO_PUBLIC_DEV_API_URL,
    discoverEndpoint: process.env.EXPO_PUBLIC_DISCOVER_ENDPOINT,
    likeEndpoint: process.env.EXPO_PUBLIC_LIKE_ENDPOINT,
    dislikeEndpoint: process.env.EXPO_PUBLIC_DISLIKE_ENDPOINT,
    genresEndpoint: process.env.EXPO_PUBLIC_GENRES_ENDPOINT,
    excerptDirectory: process.env.EXPO_PUBLIC_EXCERPT_DIRECTORY,
    loginEndpoint: process.env.EXPO_PUBLIC_LOGIN_ENDPOINT,
    signupEndpoint: process.env.EXPO_PUBLIC_SIGNUP_ENDPOINT,
    mailCheckEndpoint: process.env.EXPO_PUBLIC_MAILCHECK_ENDPOINT,
    askResetPwEndpoint: process.env.EXPO_PUBLIC_ASKRESETPW_ENDPOINT,
    resetPwEndpoint: process.env.EXPO_PUBLIC_RESETPW_ENDPOINT,
    updatedGenresEndpoint: process.env.EXPO_PUBLIC_UPDATEGENRES_ENDPOINT,
  };

  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

const useCheckedEnvContext = (): ICheckedEnv => {
  const env = useContext(EnvContext);

  if (!env) {
    throw new Error("Error: EnvContext is used where it is not provided");
  }

  const keys = Object.keys(env);

  for (const key of keys) {
    if (!env[key]) {
      throw new Error(
        "Error: The following environment variable is not defined => " + key
      );
    }
  }

  return env as ICheckedEnv;
};

export { EnvProvider, useCheckedEnvContext };
