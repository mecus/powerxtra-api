import { IPlaylist, ITrack } from "../../interfaces";
import { PlaylistModel, TrackModel } from "../../models";

export class Playlist {

  static createPlaylist(playlistData: IPlaylist) {
    return new Promise(async(resolve, reject) => {
      try{
        const newPlaylist = new PlaylistModel(playlistData);
        const Playlist = await newPlaylist.save();
        resolve(Playlist);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static getPlaylist(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const Playlist = await PlaylistModel.findOne({_id: ID});
        resolve(Playlist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static listPlaylists(query: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const Playlists = await PlaylistModel.find(query);
        resolve(Playlists);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    })
  }
  static updatePlaylist(ID: string, patch: IPlaylist) {
    return new Promise(async(resolve, reject) => {
      try{
        const PlaylistUpdate = await PlaylistModel.updateOne({_id: ID}, patch);
        resolve(PlaylistUpdate);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static deletePlaylist(ID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const deletePlaylist = await PlaylistModel.deleteOne({_id: ID});
        resolve(deletePlaylist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static addTrack(TrackID: string, PlaylistID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const Playlist: IPlaylist | any = await PlaylistModel.findOne({_id: PlaylistID});
        const Track: ITrack | any = await TrackModel.findOne({_id: TrackID});
         Playlist?.tracks.push(Track);
         const updatePlaylist = Playlist.save();
        resolve(updatePlaylist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
  static removeTrack(TrackID: string, PlaylistID: string) {
    return new Promise(async(resolve, reject) => {
      try{
        const Playlist: IPlaylist | any = await PlaylistModel.findOne({_id: PlaylistID});
        const tracks: [string] = Playlist.tracks;
        const updatedTracks = tracks.filter((track: any) => track._id !== TrackID)
        Playlist.tracks = updatedTracks;
        const updatePlaylist = Playlist.save();
        resolve(updatePlaylist);
      }catch(err) {
        resolve({error: err, status: "error"});
      }
    });
  }
}
