import { useCallback } from "react";
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";

interface OpenURLButtonProps {
  url: string;
  children: string;
  style: StyleProp<TextStyle>;
}

const OpenURLButton = ({ url, children, style }: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <Pressable onPress={handlePress}>
      <Text style={[styles.pressable, style]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    textDecorationLine: "underline",
  },
});

export default OpenURLButton;
