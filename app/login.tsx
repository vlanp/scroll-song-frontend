import { useCheckedAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { IUser } from "@/models/IUser";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const authState = useCheckedAuthContext();
  const env = useCheckedEnvContext();
  const [email, setEmail] = useState<string>("Adresse mail");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("Mot de passe");
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
    <View>
      <Text>Se connecter</Text>
      <Text>
        Merci de vous connecter afin d&apos;utiliser l&apos;application
      </Text>
      <TextInput value={email} onChangeText={setEmail} />
      {emailError && <Text>{emailError}</Text>}
      <TextInput value={password} onChangeText={setPassword} />
      {passwordError && <Text>{passwordError}</Text>}
      <Text>Mot de passe oublié</Text>
      <Pressable onPress={handleSubmit}>
        <Text>Connexion</Text>
      </Pressable>
      {formError && <Text>{formError}</Text>}
      <View>
        <Text>Vous n&apos;avez pas de compte ?</Text>
        <Text onPress={() => router.push("/signup")}>
          Inscrivez-vous maintenant !
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
