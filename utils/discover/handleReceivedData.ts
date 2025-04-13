import arrayShuffle from "array-shuffle";
import DiscoverSound from "../../models/DiscoverSound";

const handleReceivedData = (sounds: DiscoverSound[]) => {
  const constructedSounds = sounds.map((sound) => {
    // If we don't do that, sounds won't be recognized as instanceof DiscoverSound
    return new DiscoverSound(
      sound.id,
      sound.artist,
      sound.sourceUrl,
      sound.title,
      sound.pictureUrl,
      sound.genres,
      sound.audioUrl,
      sound.startTimeExcerptMs,
      sound.endTimeExcerptMs
    );
  });
  return arrayShuffle(constructedSounds);
};

export default handleReceivedData;
