import IDiscoverSound from "@/models/DiscoverSound";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const likeSound = async (
  sounds: IDiscoverSound[],
  setSounds: Dispatch<SetStateAction<IDiscoverSound[]>>,
  currentPosition: number,
  authToken: string,
  setLikedTitleToDisplay: (likedTitleToDisplay: {
    title: string;
    id: string;
  }) => void
) => {
  try {
    const currentSound = sounds[currentPosition];
    const currentSoundId = currentSound.id;
    setLikedTitleToDisplay({
      id: currentSoundId,
      title: currentSound.title,
    });
    const endpoint = "/discover/like/";
    await axios.post(
      process.env.EXPO_PUBLIC_API_URL + endpoint + currentSoundId,
      undefined,
      {
        headers: { Authorization: "Bearer " + authToken },
      }
    );

    setSounds((sounds) => {
      const _sounds = [...sounds];
      _sounds.splice(currentPosition, 1);
      return _sounds;
    });
  } catch (error) {
    console.log("An error occured while liking the song: " + error);
  }
};

export default likeSound;
