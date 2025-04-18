import { Redirect, Tabs } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StoresInitializer from "@/components/stores/StoresInitializer";
import { useCheckedAuthContext } from "@/contexts/authContext";

const ProtectedLayout = () => {
  const authState = useCheckedAuthContext();

  if (authState.status !== "authSuccess") {
    return <Redirect href={"/login"} />;
  }

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <GestureHandlerRootView>
        <StoresInitializer>
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Découverte",
              }}
            />
            <Tabs.Screen
              name="genres"
              options={{
                title: "Genres",
              }}
            />
            <Tabs.Screen
              name="favorites"
              options={{
                title: "Favoris",
              }}
            />
            <Tabs.Screen
              name="storage"
              options={{
                title: "Stockage",
              }}
            />
          </Tabs>
        </StoresInitializer>
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

export default ProtectedLayout;
