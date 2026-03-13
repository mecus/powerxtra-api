
import { model, Schema } from "mongoose";
import { IArtist } from "../interfaces";

const docType = Schema.Types;

const Artistchema = new Schema<IArtist>({
  name: {type: String},
  artwork: {type: String},
  photos: {type: String},
  active: {type: docType.Boolean},
  status: {type: String},
  category: {type: String},
  tags: {type: String},
  createdBy: {type: String},
  start_date: {type: docType.Date},
  date_created: {type: docType.Date},
  genres: {type: String},
  singles: {type: [docType.ObjectId]},
  albums: {type: [docType.ObjectId]},
  about: {type: String},
  object: {type: String, default: "artist"}, // artist

}, { timestamps: true } );


const ArtistModel = model<IArtist>("Artist", Artistchema);
export { ArtistModel };
