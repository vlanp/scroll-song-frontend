import DiscoverSound from "@/models/DiscoverSound";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import axios from "axios";

const likeSound = async (sound: DiscoverSound, authToken: string) => {
  try {
    console.log(sound.id);
    const removeDiscoverSound = useDiscoverStore.getState().removeDiscoverSound;
    const setLikedTitleToDisplay =
      useDiscoverStore.getState().setLikedTitleToDisplay;
    setLikedTitleToDisplay({
      id: sound.id,
      title: sound.title,
    });
    const discoverEndpoint = process.env.EXPO_PUBLIC_DISCOVER_ENDPOINT;
    const likeEndpoint = process.env.EXPO_PUBLIC_LIKE_ENDPOINT;
    if (!discoverEndpoint || !likeEndpoint) {
      throw new Error("Endpoints are not defined");
    }
    const endpoint = `${discoverEndpoint}${likeEndpoint}`;
    await axios.post(
      process.env.EXPO_PUBLIC_API_URL + endpoint + "/" + sound.id,
      undefined,
      {
        headers: { Authorization: "Bearer " + authToken },
      }
    );
    removeDiscoverSound(sound.id);
  } catch (error) {
    console.log("An error occured while liking the song: " + error);
  }
};

export default likeSound;
