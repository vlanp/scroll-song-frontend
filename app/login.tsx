import Baseline from "@/components/Baseline";
import { BasicText } from "@/components/forms/BasicText";
import { ErrorText } from "@/components/forms/ErrorText";
import { FormInput } from "@/components/forms/FormInput";
import GradientButton from "@/components/GradientButton";
import TabTitle from "@/components/TabTitle";
import { useCheckedAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { IUser } from "@/models/IUser";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const authState = useCheckedAuthContext();
  const env = useCheckedEnvContext();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormError(null);
    if (!email) {
      setEmailError("Une adresse mail est nécessaire.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("L'adresse mail n'est pas valide.");
    } else {
      setEmailError(null);
    }
  }, [email]);

  useEffect(() => {
    setFormError(null);
    if (!password) {
      setPasswordError("Un mot de passe est nécessaire.");
    } else if (password.length < 6) {
      setPasswordError("Le mot de passe doit faire au moins 6 caractères.");
    } else {
      setPasswordError(null);
    }
  }, [password]);

  const handleSubmit = () => {
    if (emailError || passwordError) {
      setFormError("Le formulaire contient des erreur. Merci de les corriger.");
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    axios
      .post<IUser>(
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
          authState.logIn(data.token);
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
        }
      });
  };

  return (
    <View style={styles.mainView}>
      <TabTitle
        title="Se connecter"
        baseline="Merci de vous connecter afin d'utiliser l'application"
      />
      <FormInput
        value={email}
        placeholder={"Adresse mail"}
        onChangeText={setEmail}
        autoComplete="email"
        error={emailError}
      />
      <FormInput
        value={password}
        placeholder={"Mot de passe"}
        onChangeText={setPassword}
        autoComplete="current-password"
        error={passwordError}
      />
      <View style={styles.connectView}>
        <GradientButton
          text={"Connexion"}
          onPress={handleSubmit}
        ></GradientButton>
        {formError && <ErrorText>{formError}</ErrorText>}
        <View style={styles.basicView}>
          <BasicText>Mot de passe oublié ?</BasicText>
          <BasicText onPress={() => router.push("/signup")}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "black",
    flex: 1,
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
