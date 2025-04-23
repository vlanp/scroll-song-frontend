import { StyleSheet, Text, TextInput, View } from "react-native";
import { ErrorText } from "./ErrorText";
import { passwordStrength } from "check-password-strength";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

interface IStrengthMapping {
  "Too weak": string;
  Weak: string;
  Medium: string;
  Strong: string;
}

type IStrength = keyof IStrengthMapping;

const strengthTranslations: IStrengthMapping = {
  "Too weak": "Très faible",
  Weak: "Faible",
  Medium: "Moyen",
  Strong: "Forte",
};

const strengthColors: IStrengthMapping = {
  "Too weak": "red",
  Weak: "orange",
  Medium: "yellow",
  Strong: "green",
};

const FormInput = ({
  value,
  placeholder,
  onChangeText,
  autoComplete,
  error,
  editable,
}: {
  value: string;
  placeholder?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  autoComplete?: "email" | "current-password" | "new-password" | "username";
  error?: string | undefined | null;
  editable?: boolean | undefined;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isPasswordField =
    autoComplete === "current-password" || autoComplete === "new-password";
  let translatedStrength: string | null = null;
  let strengthColor = "red";
  if (autoComplete === "new-password") {
    const strength = passwordStrength<IStrength>(value).value;

    translatedStrength = strengthTranslations[strength];
    strengthColor = strengthColors[strength];
  }
  const styles = getStyles(strengthColor);
  return (
    <View style={styles.formView}>
      <View>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(text) =>
            onChangeText &&
            onChangeText(autoComplete === "email" ? text.toLowerCase() : text)
          }
          style={[styles.formInput, editable === false && styles.disabledInput]}
          maxLength={30}
          placeholderTextColor={"lightgrey"}
          autoCapitalize="none"
          autoComplete={autoComplete}
          secureTextEntry={isPasswordField && !showPassword}
          editable={editable}
        />
        {isPasswordField && !showPassword && (
          <FontAwesome
            style={styles.showHide}
            name="eye"
            size={24}
            color="white"
            onPress={() => setShowPassword(true)}
          />
        )}
        {isPasswordField && showPassword && (
          <FontAwesome
            style={styles.showHide}
            name="eye-slash"
            size={24}
            color="white"
            onPress={() => setShowPassword(false)}
          />
        )}
      </View>
      {autoComplete === "new-password" && (
        <Text style={styles.passwordStrength}>
          {"Force du mot de passe : " + translatedStrength}
        </Text>
      )}
      <ErrorText>{error || ""}</ErrorText>
    </View>
  );
};

const getStyles = (strengthColor: string) => {
  const formInputHeight = 50;
  const styles = StyleSheet.create({
    formView: {
      alignSelf: "center",
      width: "90%",
    },
    passwordStrength: {
      textAlign: "center",
      color: strengthColor,
      fontFamily: "Poppins-Bold",
      fontSize: 14,
    },
    showHide: {
      position: "absolute",
      top: formInputHeight / 2 - 4,
      right: 10,
    },
    formInput: {
      marginVertical: 10,
      paddingHorizontal: 10,
      height: formInputHeight,
      width: "100%",
      borderStyle: "solid",
      borderColor: "white",
      borderWidth: 2,
      borderRadius: 10,
      fontFamily: "Poppins-SemiBold",
      color: "white",
      fontSize: 16,
    },
    disabledInput: {
      backgroundColor: "#1a1a1a",
      borderColor: "#333",
      color: "#666",
      opacity: 0.7,
    },
  });
  return styles;
};

export { FormInput };
