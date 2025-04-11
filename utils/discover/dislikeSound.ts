import IDiscoverSound from "@/models/DiscoverSound";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const dislikeSong = async (
  sounds: IDiscoverSound[],
  setSounds: Dispatch<SetStateAction<IDiscoverSound[]>>,
  currentPosition: number,
  authToken: string
) => {
  try {
    const currentSound = sounds[currentPosition];
    const currentSoundId = currentSound.id;
    const endpoint = "/discover/dislike/";
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
    console.log("An error occured while disliking the song: " + error);
  }
};

export default dislikeSong;
