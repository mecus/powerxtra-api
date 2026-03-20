import { PresenterModel } from "../../models";
import { IPresenter } from "../../interfaces";


export class Presenter {

  static createPresenter(preData: IPresenter) {
    return new Promise(async(resolve, reject) => {
      try{
        const presenter = new PresenterModel(preData);
        const savePresenter = await presenter.save();
        resolve(savePresenter);
      }catch(err){
        reject(err);
      }
    });
  }

  static listPresenter(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const presenters = await PresenterModel.find(query);
        resolve(presenters);
      }catch(err){
        resolve(null);
      }
    })
  }
  static getPresenter(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const presenter = await PresenterModel.findOne({_id: ID});
        resolve(presenter);
      }catch(err){
        resolve(null);
      }
    })
  }
  static updatePresenter(ID: string, preData: IPresenter) {
    return new Promise(async(resolve, reject) => {
      try{
        const updatePresenter =await  PresenterModel.updateOne({_id: ID}, preData);
        resolve(updatePresenter);
      }catch(err){
        reject(err);
      }
    });
  }
  static deletePresenter(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deletedPresenter = await PresenterModel.deleteOne({_id: ID});
        resolve(deletedPresenter);
      }catch(err){
        resolve(null);
      }
    })
  }
}
