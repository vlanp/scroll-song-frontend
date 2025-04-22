import { BasicText } from "@/components/forms/BasicText";
import { ErrorText } from "@/components/forms/ErrorText";
import { FormInput } from "@/components/forms/FormInput";
import GradientButton from "@/components/GradientButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import { useCheckedAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { IUser } from "@/models/IUser";
import { IVerifCode } from "@/models/IVerifCode";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const authState = useCheckedAuthContext();
  const env = useCheckedEnvContext();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkForm = (): boolean => {
    let isThereInputErrors = false;

    if (!email) {
      isThereInputErrors = true;
      setEmailError("Une adresse mail est nécessaire.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isThereInputErrors = true;
      setEmailError("L'adresse mail n'est pas valide.");
    } else {
      setEmailError(null);
    }

    if (!password) {
      isThereInputErrors = true;
      setPasswordError("Un mot de passe est nécessaire.");
    } else {
      setPasswordError(null);
    }

    return isThereInputErrors;
  };

  useEffect(() => {
    setEmailError(null);
  }, [email]);

  useEffect(() => {
    setPasswordError(null);
  }, [password]);

  const handleSubmit = () => {
    setIsLoading(true);
    setFormError(null);
    const isThereInputErrors = checkForm();
    if (isThereInputErrors) {
      setIsLoading(false);
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    axios
      .post<IUser | IVerifCode>(
        env.apiUrl + env.loginEndpoint,
        {
          email,
          password,
        },
        { signal: abortController.signal }
      )
      .then((response) => {
        if (!signal.aborted) {
          const data = response.data;
          if ("validUntil" in data) {
            const email = data.email;
            const validUntil = data.validUntil;
            router.replace({
              pathname: "/verifEmail",
              params: { email, validUntil },
            });
          } else {
            authState.logIn(data.token);
          }
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          if (error?.response?.status === 404) {
            setFormError(
              "Aucun utilisateur trouvé avec ce mail et ce mot de passe."
            );
          } else {
            console.log(error);
            setFormError(
              "Une erreur inconnue s'est produite. Merci de réessayer ultérieurement."
            );
          }
          setIsLoading(false);
        }
      });
  };

  return (
    <ScreenContainer style={styles.mainView}>
      <ScreenTitle
        title="Se connecter"
        baseline="Merci de vous connecter afin d'utiliser l'application"
      />
      <FormInput
        value={email}
        placeholder={"Adresse mail"}
        onChangeText={setEmail}
        autoComplete="email"
        error={emailError}
        editable={!isLoading}
      />
      <FormInput
        value={password}
        placeholder={"Mot de passe"}
        onChangeText={setPassword}
        autoComplete="current-password"
        error={passwordError}
        editable={!isLoading}
      />
      <View style={styles.connectView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <GradientButton
            text={"Connexion"}
            onPress={handleSubmit}
          ></GradientButton>
        )}
        {formError && <ErrorText>{formError}</ErrorText>}
        <View style={styles.basicView}>
          <BasicText>Mot de passe oublié ?</BasicText>
          <BasicText onPress={() => router.push("/verifEmail")}>
            Réinitialisez le maintenant !
          </BasicText>
        </View>
        <View style={styles.basicView}>
          <BasicText>Vous n&apos;avez pas de compte ?</BasicText>
          <BasicText onPress={() => router.push("/signup")}>
            Inscrivez-vous maintenant !
          </BasicText>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainView: {
    display: "flex",
    justifyContent: "space-between",
  },
  connectView: {
    alignSelf: "center",
    gap: 15,
    width: "90%",
  },
  basicView: {
    gap: 5,
  },
});

export default LoginScreen;
