import { ErrorText } from "@/components/forms/ErrorText";
import { FormInput } from "@/components/forms/FormInput";
import GradientButton from "@/components/GradientButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import { useSuccessfulAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { IUser } from "@/models/IUser";
import axios from "axios";
import { passwordStrength } from "check-password-strength";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const ResetPwScreen = () => {
  const router = useRouter();
  const authState = useSuccessfulAuthContext();
  const env = useCheckedEnvContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rePassword, setRePassword] = useState<string>("");
  const [rePasswordError, setRePasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setPasswordError(null);
  }, [password]);

  useEffect(() => {
    setRePasswordError(null);
  }, [rePassword]);

  const checkForm = (): boolean => {
    let isThereInputErrors = false;

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
      .put<IUser>(
        env.apiUrl + env.resetPwEndpoint,
        {
          newPassword: password,
        },
        {
          headers: { Authorization: "Bearer " + authState.authToken },
        }
      )
      .then((response) => {
        const newToken = response.data.token;
        authState.logIn(newToken);
        router.replace({
          pathname: "/parameters",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("An unknown error occured while updating password.", error);
        setFormError(
          "Une erreur inconnue s'est produite. Merci de réessayer ultérieurement."
        );
        setIsLoading(false);
      });
  };

  return (
    <ScreenContainer style={styles.mainView}>
      <ScreenTitle
        title="Reset du mot de passe"
        baseline="Merci d'indiquer le nouveau mot de passe à utiliser"
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
      <View style={styles.confirmView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <GradientButton
            text={"Confirmer le changement"}
            onPress={handleSubmit}
          ></GradientButton>
        )}
        {formError && <ErrorText>{formError}</ErrorText>}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainView: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmView: {
    alignSelf: "center",
    gap: 15,
    width: "90%",
  },
});

export default ResetPwScreen;
