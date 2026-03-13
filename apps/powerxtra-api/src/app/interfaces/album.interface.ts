// import { ITrack } from "./track.interface";
import { Types } from "mongoose";

export interface IAlbum {
  name: string,
  artist: string;
  artwork: string;
  release_date: Date;
  release_year: string;
  track_counts: number;
  duration: number;
  photos: string;
  createdBy: string;
  dateCreated: Date;
  status: string;
  active: boolean;
  genre: string; // Afrobeat
  tags: string;
  category: string; // internation | local
  tracks: [Types.ObjectId];
  description: string;
  object?: string;
  visibility?: boolean;
}
