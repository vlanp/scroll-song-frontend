import { StyleSheet, TextInput, View } from "react-native";
import { ErrorText } from "./ErrorText";

const FormInput = ({
  value,
  placeholder,
  onChangeText,
  autoComplete,
  error,
}: {
  value?: string | undefined;
  placeholder?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  autoComplete?: "email" | "current-password" | "new-password";
  error?: string | undefined | null;
}) => {
  return (
    <View style={styles.formView}>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.formInput}
        maxLength={30}
        placeholderTextColor={"lightgrey"}
        autoCapitalize="none"
        autoComplete={autoComplete}
      ></TextInput>
      <ErrorText>{error || ""}</ErrorText>
    </View>
  );
};

const styles = StyleSheet.create({
  formView: {
    alignSelf: "center",
    width: "90%",
  },
  formInput: {
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 60,
    width: "100%",
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: "PoppinsSemiBold",
    color: "white",
    fontSize: 16,
  },
});

export { FormInput };
