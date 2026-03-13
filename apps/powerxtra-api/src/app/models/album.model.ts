import { model, Schema } from "mongoose";
import { IAlbum } from "../interfaces";

const docType = Schema.Types;

const AlbumSchema = new Schema<IAlbum>({
  name: {type: String},
  artist: {type: String},
  artwork: {type: String},
  photos: {type: String},
  duration: {type: docType.Number},
  active: {type: docType.Boolean},
  status: {type: String},
  category: {type: String},
  tags: {type: String},
  createdBy: {type: String},
  dateCreated: {type: docType.Date},
  release_date: {type: docType.Date},
  release_year: {type: String},
  track_counts: {type: docType.Number},
  genre: {type: String},
  tracks: {type: [{type: Schema.ObjectId, ref: 'Track'}]},
  description: {type: String},
  object: {type: String, default: "album"}, // album | playlist | selections | ep
  visibility: {type: docType.Boolean, defailt: false},

}, { timestamps: true } );

// AlbumSchema.post('findOne', async (doc: IAlbum & Document) => {
//   const Track = doc.model('Track');
//   const tracks = await Track.find({album_id: doc._id });
//   doc.tracks = tracks

//   if(tracks?.length){
//     doc.track_counts = tracks.length;
//   }
//    console.log(doc)
// });

const AlbumModel = model<IAlbum>("Album", AlbumSchema);
export { AlbumModel };
