import { AuthProvider } from "@/contexts/authContext";
import { EnvProvider } from "@/contexts/envContext";
import { SplashScreen, Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // console.log(getLoadedFonts());

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <GestureHandlerRootView>
        <EnvProvider>
          <AuthProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </AuthProvider>
        </EnvProvider>
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
});

export default RootLayout;
