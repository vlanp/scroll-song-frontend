import { DownloadResumable } from "expo-file-system";

interface IDiscoverSound {
  id: string;
  title: string;
  url: string;
  start_time_excerpt_ms: number;
  end_time_excerpt_ms: number;
}

export default IDiscoverSound;
