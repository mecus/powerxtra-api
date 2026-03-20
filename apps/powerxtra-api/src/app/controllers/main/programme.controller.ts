import { ProgrammeModel } from "../../models";
import { IProgramme } from "../../interfaces";


export class Programme {

  static createProgramme(progData: IProgramme) {
    return new Promise(async(resolve, reject) => {
      try{
        const programm = new ProgrammeModel(progData);
        const saveProgramm = await programm.save();
        resolve(saveProgramm);
      }catch(err){
        reject(err);
      }
    });
  }

  static listProgramme(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const programmes = await ProgrammeModel.find(query);
        resolve(programmes);
      }catch(err){
        resolve(null);
      }
    })
  }
  static getProgramme(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const programme = await ProgrammeModel.findOne({_id: ID});
        resolve(programme);
      }catch(err){
        resolve(null);
      }
    })
  }
  static updateProgramme(ID: string, progData: IProgramme) {
    return new Promise(async(resolve, reject) => {
      try{
        const updateProgramm = await  ProgrammeModel.updateOne({_id: ID}, progData);
        resolve(updateProgramm);
      }catch(err){
        reject(err);
      }
    });
  }
  static deleteProgramme(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deletedProgramme = await ProgrammeModel.deleteOne({_id: ID});
        resolve(deletedProgramme);
      }catch(err){
        resolve(null);
      }
    })
  }
}
