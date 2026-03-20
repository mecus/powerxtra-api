import { ObjectId } from "mongoose";
import { IAlbum, ITrack } from "../../interfaces";
import { AlbumModel } from "../../models";

export class Album {

  static createAlbum(albumData: IAlbum) {
    return new Promise(async(resolve, reject) => {
      try{
        const newAlbum = new AlbumModel(albumData);
        const Album = await newAlbum.save();
        resolve(Album);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static getAlbum(ID: string) {
    return new Promise(async(resolve, reject) => {
      // return with tracks
      try{
        const Album: IAlbum | any = await AlbumModel.findOne({_id: ID})
        // .sort({ upload_date: -1 })
        .populate<{tracks: ITrack}>('tracks');
        // const tracks: ITrack[] | any = await TrackModel.find({album_id: ID});

        // Album.tracks = tracks;
        // const data = {album: Album, tracks};
        console.log(Album);
        resolve(Album);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static gueryAlbums(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const Albums = await AlbumModel.find(query);
        resolve(Albums);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    })
  }
  static updateAlbum(ID: string, patch: IAlbum) {
    return new Promise(async(resolve, reject) => {
      try{
        const AlbumUpdate = await AlbumModel.updateOne({_id: ID}, patch);
        resolve(AlbumUpdate);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static deleteAlbum(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deleteAlbum = await AlbumModel.deleteOne({_id: ID});
        resolve(deleteAlbum);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static addTrack(data: {track_id: string, album_id: string, album: string}) { // {trackID, album, albumID}
    return new Promise(async(resolve, reject) => {
      try{
         const album: IAlbum | any = await AlbumModel.findOne({_id: data.album_id});
         let trackIds: Array<ObjectId | any> = album.tracks;
         const trackId = data.track_id;
         trackIds.push(trackId);
          album.tracks = trackIds;
          album.track_counts = trackIds.length;
          const updateAlbum = await album.save();
          console.log(updateAlbum);

        // const Album: IAlbum | any = await AlbumModel.findOne({_id: AlbumID});
        // const track: ITrack | any = await TrackModel.findOne({_id: data.track_id});
        // track.album_id = data.album_id;
        // track.album = data.album;
        //  const updateAlbum = await track.save();
        //  console.log(updateAlbum)
         const Album: IAlbum | any = await AlbumModel.findOne({_id: data.album_id});
        resolve(Album);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static removeTrack( data: {track_id: string, album_id: string, album: string} ) {
    return new Promise(async(resolve, reject) => {
      try{
        const album: IAlbum | any = await AlbumModel.findOne({_id: data.album_id});
        let trackIds: Array<ObjectId | any> = album.tracks;
        const trackId = data.track_id;
        const index = trackIds.indexOf((x:any) => x == trackId);
        console.log("INDX", index);
        console.log(data)
        console.log(trackIds)
        const updateTrackIds = trackIds.filter(x => x.toString() !== trackId); //.splice(index, 0);
        album.tracks = updateTrackIds;
        album.track_counts = updateTrackIds.length;
        const updateAlbum = await album.save();
        console.log(updateAlbum);

         const Album: IAlbum | any = await AlbumModel.findOne({_id: data.album_id});
        resolve(Album);
        // const Album: IAlbum | any = await AlbumModel.findOne({_id: AlbumID});
        // const tracks: [string] = Album.tracks;
        // const updatedTracks = tracks.filter((track: any) => track._id !== TrackID)
        // Album.tracks = updatedTracks;
        // const updateAlbum = Album.save();
        // resolve(updateAlbum);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
}
