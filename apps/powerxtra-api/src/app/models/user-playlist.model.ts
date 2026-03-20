import { model, Schema } from "mongoose";
import { IPlaylist } from "../interfaces";

const docType = Schema.Types;

const PlaylisStchema = new Schema<IPlaylist>({
  name: {type: String},
  artwork: {type: String},
  photos: {type: String},
  duration: {type: docType.Number},
  active: {type: docType.Boolean},
  status: {type: String},
  category: {type: String},
  tags: {type: String},
  createdBy: {type: String},
  owner_id: {type: String},
  date_created: {type: docType.Date},
  track_counts: {type: docType.Number},
  genres: {type: String},
  tracks: {type: [docType.ObjectId]},
  description: {type: String},
  object: {type: String, default: "playlist"}, // playlist

}, { timestamps: true } );


const PlaylistModel = model<IPlaylist>("Playlist", PlaylisStchema);
export { PlaylistModel };
