import { LikedSound } from "../../models/LikedSound";

const handleReceivedData = (sounds: LikedSound[]) => {
  return sounds.map((sound) => {
    // If we don't do that, sounds won't be recognized as instanceof LikedSound
    return new LikedSound(
      sound.id,
      sound.title,
      sound.artist,
      sound.sourceUrl,
      sound.genres,
      sound.pictureUrl,
      sound.audioUrl,
      sound.durationMs
    );
  });
};

export default handleReceivedData;
