import { ITrack } from "../../interfaces";
import { TrackModel } from "../../models";

export class Track {

  static createTrack(trackData: ITrack) {
    return new Promise(async(resolve, reject) => {
      try{
        const newTrack = new TrackModel(trackData);
        const track = await newTrack.save();
        resolve(track);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static getTrack(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const Track = await TrackModel.findOne({_id: ID});
        resolve(Track);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static listTracks(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const Tracks = await TrackModel.find(query);
        resolve(Tracks);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    })
  }
  static updateTrack(ID: string, patch: ITrack) {
    return new Promise(async(resolve, reject) => {
      try{
        const trackUpdate = await TrackModel.updateOne({_id: ID}, patch);
        resolve(trackUpdate);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static deleteTrack(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deleteTrack = await TrackModel.deleteOne({_id: ID});
        resolve(deleteTrack);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }

}
