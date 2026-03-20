import { ITrack } from "./track.interface";

export interface IPlaylist {
  name: string,
  type: string; // radio | general | user
  artwork?: string;
  duration?: number;
  photos?: string; // string array of photos
  createdBy: string; // user name
  owner_id: string; // userID
  date_created: Date;
  status: string; // pending | disabled | enabled | deleted
  active: boolean;
  genres?: string; // Afrobeat | hip-pop | country
  tags?: string; // trending-new song-upcoming
  category?: string; // internation | local
  tracks?: ITrack[] | any,
  track_counts?: number;
  description?: string;
  object?: string;
}
