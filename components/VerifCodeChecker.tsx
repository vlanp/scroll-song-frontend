import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Clipboard,
} from "react-native";
import { useState, useRef } from "react";

type char = string & { length: 1 };
type code = string & { length: 8 };

const VerifCodeChecker = () => {
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
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

  // Fonction pour vérifier le code
  const verifyCode = () => {
    const fullCode = code.join("");
    // Ici, vous pourriez implémenter votre logique de vérification
    // Par exemple, comparer avec un code attendu ou envoyer une requête à votre API
    console.log("Code à vérifier:", fullCode);
    setIsVerified(true); // Pour l'exemple, on considère que le code est valide
  };

  return (
    <View style={styles.mainView}>
      <Text style={styles.title}>Vérification du code</Text>
      <Text style={styles.subtitle}>Entrez le code reçu par email</Text>

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

      {isVerified ? (
        <Text style={styles.successMessage}>Code vérifié avec succès!</Text>
      ) : (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={verifyCode}
          disabled={code.includes("")}
        >
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>
      )}
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
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
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
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    color: "#4CD964",
    fontSize: 16,
    marginTop: 20,
  },
});

export { VerifCodeChecker };
