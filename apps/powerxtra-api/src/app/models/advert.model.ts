
import { model, Schema } from "mongoose";
import { IAdvert } from "../interfaces";

const docType = Schema.Types;

const AdvertSchema = new Schema<IAdvert>({
  title: {type: String},
  business_name: {type: String},
  type: {type: String}, // graphics | audio
  category: {type: String},
  tags: {type: [String]},
  start_date: {type: docType.Date},
  end_date: {type: docType.Date},
  description: {type: String},
  createdBy: {type: String},
  deletedAt: {type: docType.Date,
    default: null,
    index: true
  },
  imageUrl: {type: String},
  videoUrl: {type: String},
  published: {type: docType.Boolean},
  status: {type: String},
  active:{type: docType.Boolean},
  fileUrl: {type: String}
}, {timestamps: true});

const AdvertModel = model<IAdvert>("Advert", AdvertSchema);
export { AdvertModel };
