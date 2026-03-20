import { model, Schema } from "mongoose";
import { IUser } from "../interfaces";
// import { IUser } from "../interfaces";

const docType = Schema.Types;

const UserSchema = new Schema<IUser> ({
  displayName: {type: String},
  first_name: {type: String},
  last_name: {type: String},
  email: {type: String},
  accountType: {type: String},
  category: {type: String},
  phone: {type: String},
  avatar: {type: String},
  start_date: {type: docType.Date},
  date_created: {type: docType.Date},
  createdBy: {type: String},
  status: {type: String}, // active | suspended | deleted | pending
  active: {type: docType.Boolean},
  tags: {type: String},
  uid: {type: String},
  roles: {type: String}, // presender | admin | upload | user
}, {timestamps: true});


const UserModel = model<IUser>("User", UserSchema);
export { UserModel };
