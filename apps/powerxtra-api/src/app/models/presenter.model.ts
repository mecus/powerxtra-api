import { model, Schema } from "mongoose";
import { IPresenter } from "../interfaces";

const docType = Schema.Types;

export const PresenterSchema = new Schema<IPresenter>({
  name: {type: String},
  uid: {type: String},
  category: {type: String},
  avatar: {type: String},
  active: {type: docType.Boolean},
  settings: {type: String},
}, {timestamps: true});


const PresenterModel = model<IPresenter>("Presenter", PresenterSchema);
export { PresenterModel };
