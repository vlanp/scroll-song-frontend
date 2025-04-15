import DiscoverSound from "@/models/DiscoverSound";

import useDiscoverStore from "@/zustands/useDiscoverStore";
import axios from "axios";

const dislikeSound = async (sound: DiscoverSound, authToken: string) => {
  try {
    const removeDiscoverSound = useDiscoverStore.getState().removeDiscoverSound;
    const discoverEndpoint = process.env.EXPO_PUBLIC_DISCOVER_ENDPOINT;
    const dislike = process.env.EXPO_PUBLIC_DISLIKE_ENDPOINT;
    if (!discoverEndpoint || !dislike) {
      throw new Error("Endpoints are not defined");
    }
    const endpoint = `${discoverEndpoint}${dislike}`;
    await axios.post(
      process.env.EXPO_PUBLIC_API_URL + endpoint + "/" + sound.id,
      undefined,
      {
        headers: { Authorization: "Bearer " + authToken },
      }
    );

    removeDiscoverSound(sound.id);
  } catch (error) {
    console.log("An error occured while disliking the song: " + error);
  }
};

export default dislikeSound;
