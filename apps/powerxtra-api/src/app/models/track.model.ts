import { model, Schema } from "mongoose";
import { ITrack } from "../interfaces";

const docType = Schema.Types;

const trachSchema = new Schema<ITrack>({
  title: {type: String},
  artist: {type: String},
  artist_id: {type: String},
  album: {type: String},
  album_id: {type: String},
  artwork: {type: String},
  photos: {type: String},
  duration: {type: docType.Number},
  size: {type: docType.Number},
  bitrate: {type: docType.Number},
  active: {type: docType.Boolean},
  status: {type: String},
  category: {type: String},
  tags: {type: String},
  uploadedBy: {type: String},
  upload_date: {type: docType.Date},
  release_date: {type: docType.Date},
  release_year: {type: String},
  file: {type: String},
  genre: {type: String},
  other_artist: {type: String},
  description: {type: String},
  video: {type: String},
  listening_count: {type: docType.Number},
  object: {type: String, default: "track"}, // track
}, { timestamps: true } );


const TrackModel = model<ITrack>("Track", trachSchema);
export { TrackModel };
