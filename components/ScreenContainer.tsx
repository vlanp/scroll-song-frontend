import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const ScreenContainer = (props: PropsWithChildren<ViewProps>) => {
  const { style } = props;
  return (
    <View style={styles.container}>
      <View {...props} style={[style, { flex: 1 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#010101",
    flex: 1,
  },
});

export default ScreenContainer;
