import { IArtist } from "../../interfaces";
import { ArtistModel } from "../../models";

export class Artist {

  static createArtist(artistData: IArtist) {
    return new Promise(async(resolve, reject) => {
      try{
        const newArtist = new ArtistModel(artistData);
        const Artist = await newArtist.save();
        resolve(Artist);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }

    static getArtist(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const Artist = await ArtistModel.findOne({_id: ID});
        resolve(Artist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static listArtist(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const Artists = await ArtistModel.find(query);
        resolve(Artists);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    })
  }
  static updateArtist(ID: string, patch: IArtist) {
    return new Promise(async(resolve, reject) => {
      try{
        const ArtistUpdate = await ArtistModel.updateOne({_id: ID}, patch);
        resolve(ArtistUpdate);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static deleteArtist(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deleteArtist = await ArtistModel.deleteOne({_id: ID});
        resolve(deleteArtist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }

}
