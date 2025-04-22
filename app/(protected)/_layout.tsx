import { Redirect, SplashScreen, Tabs } from "expo-router";
import StoresInitializer from "@/components/stores/StoresInitializer";
import { useCheckedAuthContext } from "@/contexts/authContext";
import { useContext, useEffect } from "react";
import { FontsContext } from "@/contexts/fontsContext";

const ProtectedLayout = () => {
  const authState = useCheckedAuthContext();
  const fontsState = useContext(FontsContext);

  useEffect(() => {
    if (
      authState.status !== "authLoading" &&
      fontsState.status !== "fontsLoading"
    ) {
      SplashScreen.hideAsync();
    }
  }, [authState, fontsState]);

  if (authState.status === "authLoading") {
    return;
  }

  if (authState.status === "authIdle") {
    return <Redirect href={"/login"} />;
  }

  return (
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
  );
};

export default ProtectedLayout;
