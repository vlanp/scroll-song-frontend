import { Redirect, Tabs } from "expo-router";
import StoresInitializer from "@/components/stores/StoresInitializer";
import { useCheckedAuthContext } from "@/contexts/authContext";

const ProtectedLayout = () => {
  const authState = useCheckedAuthContext();

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
