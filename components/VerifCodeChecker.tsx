import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Clipboard,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { useCheckedAuthContext } from "@/contexts/authContext";
import { IUser } from "@/models/IUser";
import { ErrorText } from "./forms/ErrorText";
import { IVerifCode } from "@/models/IVerifCode";

type char = string & { length: 1 };
type code = string & { length: 8 };
type IVerifType = "PWReset" | "MailCheck";

const VerifCodeChecker = ({
  validUntil,
  verifType,
  email,
}: {
  validUntil: Date;
  verifType: IVerifType;
  email: string;
}) => {
  const authState = useCheckedAuthContext();
  const env = useCheckedEnvContext();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [timeRemeaning, setTimeRemeaning] = useState<number | null>(null);
  const [newValidUntil, setNewValidUntil] = useState<Date | null>(null);
  const [waitingNewCode, setWaitingNewCode] = useState<boolean>(false);

  const currentValidUntil = newValidUntil || validUntil;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diffMs = currentValidUntil.getTime() - now.getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));
      setTimeRemeaning(diffSec);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentValidUntil]);

  useEffect(() => {
    setError(null);
  }, [code]);

  const clearCode = () => setCode(["", "", "", "", "", "", "", ""]);

  const handleChange = (text: char | code, index: number) => {
    if (text.length === 8) {
      setCode(text.split(""));
      inputRefs.current[7]?.focus();
    } else {
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index] = text;
        return newCode;
      });
      if (text !== "" && index < 7) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const askNewCode = () => {
    setWaitingNewCode(true);
    clearCode();
    const finalUrl =
      env.apiUrl +
      (verifType === "MailCheck" ? env.mailCheckEndpoint : env.resetPwEndpoint);
    axios
      .get<IVerifCode>(finalUrl, {
        params: { email },
      })
      .then((response) => {
        setNewValidUntil(new Date(response.data.validUntil));
        setWaitingNewCode(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Une erreur inconnue s'est produite, merci de réessayer.");
        setWaitingNewCode(false);
      });
  };

  const verifyCode = () => {
    setIsLoading(true);
    const fullCode = code.join("");
    clearCode();
    const finalUrl =
      env.apiUrl +
      (verifType === "MailCheck"
        ? env.mailCheckEndpoint
        : env.resetPwEndpoint) +
      "/" +
      fullCode;
    axios
      .get<IUser>(finalUrl, {
        params: { email },
      })
      .then((response) => {
        authState.logIn(response.data.token);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 403) {
          setError("Vérification impossible, le code a expiré.");
        } else if (error?.response?.status === 406) {
          setError("Le code est incorrect.");
        } else {
          console.log(error);
          setError("Une erreur inconnue s'est produite, merci de réessayer.");
        }
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.mainView}>
        <Text style={styles.title}>Code en cours de vérification</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <Text style={styles.title}>Vérification du code</Text>
      <View style={styles.subtitles}>
        <Text style={styles.subtitle}>Entrez le code reçu par email</Text>
        {timeRemeaning !== null && (
          <Text style={styles.subtitle}>
            Le code expire dans {timeRemeaning} secondes
          </Text>
        )}
      </View>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleChange(text as char, index)}
            onPressIn={async () => {
              const clipboardString = await Clipboard.getString();
              const isCode =
                clipboardString.length === 8 &&
                !isNaN(parseInt(clipboardString, 10));
              if (!isCode) {
                return;
              }
              handleChange(clipboardString as code, 0);
            }}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      {error && <ErrorText>{error}</ErrorText>}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={verifyCode}
        disabled={code.includes("")}
      >
        <Text style={styles.buttonText}>Vérifier</Text>
      </TouchableOpacity>
      {timeRemeaning !== null && timeRemeaning < 15 ? (
        waitingNewCode ? (
          <View style={styles.newCodeView}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.newCodeView}>
            <Text style={styles.newCode} onPress={askNewCode}>
              Envoyer un nouveau code
            </Text>
          </View>
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitles: {
    gap: 10,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
  },
  newCodeView: {
    marginVertical: 20,
  },
  newCode: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  codeInput: {
    width: 25,
    height: 32,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    margin: 5,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    backgroundColor: "#333",
  },
  verifyButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export { VerifCodeChecker };
