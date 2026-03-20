import { model, Schema } from "mongoose";
import { IProgramme } from "../interfaces";

const docType = Schema.Types;

export const ProgrammeSchema = new Schema<IProgramme>({
  title: {type: String},
  presenter: {type: String},
  startTime: {type: String},
  endTime: {type: String},
  category: {type: String},
  active: {type: docType.Boolean},
  artwork: {type: String},
  presenter_id: {type: String},
  description: {type: String},
  createdBy: {type: String},
}, {timestamps: true});


const ProgrammeModel = model<IProgramme>("Programme", ProgrammeSchema);
export { ProgrammeModel };
