import { ObjectId} from "mongoose";

export interface IArtist {
  name: string,
  albums: ObjectId[]; // album IDs
  singles: ObjectId[]; // single tracks
  artwork: string;
  start_date: Date;
  photos: string;
  createdBy: string;
  date_created: Date;
  status: string;
  active: boolean;
  genres: string; // Afrobeat
  tags: string;
  category: string; // internation | local
  about: string;
  object?: string;
}
