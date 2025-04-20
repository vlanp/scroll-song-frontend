import { AuthProvider } from "@/contexts/authContext";
import { EnvProvider } from "@/contexts/envContext";
import { FontsProvider } from "@/contexts/fontsContext";
import { Stack } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <GestureHandlerRootView>
        <View style={styles.container}>
          <EnvProvider>
            <FontsProvider>
              <AuthProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </AuthProvider>
            </FontsProvider>
          </EnvProvider>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    backgroundColor: "#010101",
    flex: 1,
  },
});

export default RootLayout;
