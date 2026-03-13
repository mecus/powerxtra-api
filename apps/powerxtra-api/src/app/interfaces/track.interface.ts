
export interface ITrack {
  title: string,
  artist: string;
  artist_id?: string;
  album?: string;
  album_id?: string;
  artwork?: string;
  file?: string;
  release_date?: Date;
  release_year?: string;
  bitrate?: number; //128000
  size?: number;
  duration: number;
  photos?: string;
  uploadedBy?: string;
  upload_date: Date;
  status: string;
  active: boolean;
  genre: string; // Afrobeat
  tags?: string;
  category?: string; // internation | local
  other_artist?: string;
  description?: string;
  listening_count?: number;
  video?: string;
  object?: string;
}
