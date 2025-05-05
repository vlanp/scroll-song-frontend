import { Redirect, Tabs } from "expo-router";
import StoresInitializer from "../../components/stores/StoresInitializer";
import { useCheckedAuthContext } from "../../contexts/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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
            tabBarIcon: ({ color }) => (
              <FontAwesome name="cc-discover" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favoris",
            tabBarIcon: ({ color }) => (
              <Fontisto name="favorite" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="storage"
          options={{
            title: "Stockage",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="floppy-disk" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="parameters"
          options={{
            title: "Paramètres",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user-cog" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </StoresInitializer>
  );
};

export default ProtectedLayout;
