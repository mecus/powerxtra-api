import { model, Schema } from "mongoose";
import { INews } from "../interfaces";

const docType = Schema.Types;

const NewsSchema = new Schema<INews>({
  title: {type: String},
  type: {type: String},
  snipet: {type: String},
  author: {type: String},
  category: {type: String},
  tags: {type: String},
  trending: {type: docType.Boolean},
  featured: {type: docType.Boolean},
  publishAt: {type: docType.Date},
  expireAt: {type: docType.Date},
  content: {type: String},
  createdBy: {type: String},
  deletedAt: {type: docType.Date,
    default: null,
    index: true
  },
  imageUrl: {type: String},
  published:{type: docType.Boolean},
  status: {type: String},
}, {timestamps: true});

// NewsSchema.pre(/^find/, function(next) {
//   this.where({ deletedAt: null });
//   next();
// });

const NewsModel = model<INews>("News", NewsSchema);
export { NewsModel };
