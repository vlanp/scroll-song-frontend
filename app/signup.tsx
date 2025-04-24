import { BasicText } from "@/components/forms/BasicText";
import { ErrorText } from "@/components/forms/ErrorText";
import { FormInput } from "@/components/forms/FormInput";
import GradientButton from "@/components/GradientButton";
import ScreenTitle from "@/components/ScreenTitle";
import { useCheckedEnvContext } from "@/contexts/envContext";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { passwordStrength } from "check-password-strength";
import { IVerifCode } from "@/models/IVerifCode";
import ScreenContainer from "@/components/ScreenContainer";

const SignupScreen = () => {
  const router = useRouter();
  const env = useCheckedEnvContext();
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rePassword, setRePassword] = useState<string>("");
  const [rePasswordError, setRePasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setUsernameError(null);
  }, [username]);

  useEffect(() => {
    setEmailError(null);
  }, [email]);

  useEffect(() => {
    setPasswordError(null);
  }, [password]);

  useEffect(() => {
    setRePasswordError(null);
  }, [rePassword]);

  const checkForm = (): boolean => {
    let isThereInputErrors = false;
    if (!username) {
      isThereInputErrors = true;
      setUsernameError("Un nom d'utilisateur est nécessaire.");
    } else if (username.length < 5) {
      isThereInputErrors = true;
      setUsernameError(
        "Le nom d'utilisateur doit faire au moins 5 caractères."
      );
    } else {
      setUsernameError(null);
    }

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
    } else if (passwordStrength(password).id !== 3) {
      isThereInputErrors = true;
      setPasswordError("Merci de choisir un mot de passe fort.");
    } else {
      setPasswordError(null);
    }

    if (!rePassword) {
      isThereInputErrors = true;
      setRePasswordError("Un mot de passe est nécessaire.");
    } else if (rePassword !== password) {
      isThereInputErrors = true;
      setRePasswordError("Les 2 mots de passe ne correspondent pas.");
    } else {
      setRePasswordError(null);
    }

    return isThereInputErrors;
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setFormError(null);
    const isThereInputErrors = checkForm();
    if (isThereInputErrors) {
      setIsLoading(false);
      return;
    }
    axios
      .post<IVerifCode>(env.apiUrl + env.signupEndpoint, {
        email,
        username,
        password,
      })
      .then((response) => {
        const email = response.data.email;
        const validUntil = response.data.validUntil;
        router.replace({
          pathname: "/emailValidation",
          params: { email, validUntil },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          setFormError(
            "Cette adresse email est déjà associée à un utilisateur."
          );
        } else {
          console.log(error);
          setFormError(
            "Une erreur inconnue s'est produite. Merci de réessayer ultérieurement."
          );
        }
        setIsLoading(false);
      });
  };

  return (
    <ScreenContainer style={styles.mainView}>
      <ScreenTitle
        title="S'inscrire"
        baseline="Merci de vous inscrire afin d'utiliser l'application"
      />
      <FormInput
        value={username}
        placeholder={"Nom d'utilisateur"}
        onChangeText={setUsername}
        autoComplete="username"
        error={usernameError}
        editable={!isLoading}
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
        autoComplete="new-password"
        error={passwordError}
        editable={!isLoading}
      />
      <FormInput
        value={rePassword}
        placeholder={"Mot de passe"}
        onChangeText={setRePassword}
        autoComplete="new-password"
        error={rePasswordError}
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
          <BasicText>Vous avez déjà un compte ?</BasicText>
          <BasicText onPress={() => router.push("/login")}>
            Connectez-vous maintenant !
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

export default SignupScreen;
