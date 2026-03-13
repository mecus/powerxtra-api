
import express, {NextFunction, Request, Response} from "express";
import { Album } from "../controllers";

export const AlbumRoutes = express.Router();

AlbumRoutes.post("/albums/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newAlbum = await Album.createAlbum(data);
    res.status(201).json(newAlbum);
  }catch(err) {
    next(err);
  }
});
AlbumRoutes.get("/albums/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listAlbum = await Album.gueryAlbums(query);
    res.status(200).json(listAlbum);
  }catch(err) {
    next(err);
  }
});

AlbumRoutes.get("/albums/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const album = await Album.getAlbum(ID);
    res.status(200).json(album);
  }catch(err) {
    next(err);
  }
});

AlbumRoutes.patch("/albums/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updateAlbum = await Album.updateAlbum(ID, data);
    res.status(201).json(updateAlbum);
  }catch(err) {
    next(err);
  }
});
AlbumRoutes.delete("/albums/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delAlbum = await Album.deleteAlbum(ID);
    res.status(204).json(delAlbum);
  }catch(err) {
    next(err);
  }
});
AlbumRoutes.patch("/albums/add_track", async(req: Request, res: Response, next: NextFunction) => {
  try {
    const data: { list: [ {track_id: string, album_id: string, album: string} ] } = req.body; //  { list: [ {track_id: string, album_id: string, album: string} ] }
    let addedTracks = [];
    for(let i = 0; i < data.list.length; i++){
       const addTrack = await Album.addTrack(data.list[i]);
       addedTracks.push(addTrack);
    }
    res.status(201).json({status: "done", tracks: addedTracks});
  } catch(err) {
    next(err);
  }
});
AlbumRoutes.patch("/albums/remove_track", async(req: Request, res: Response, next: NextFunction) => {
  try {
    const data: { list: [ {track_id: string, album_id: string, album: string} ] } = req.body; //  { list: [ {track_id: string, album_id: string, album: string} ] }
    let removedTracks = [];
        for(let i = 0; i < data.list.length; i++){
        const removeTrack = await Album.removeTrack(data.list[i]);
        removedTracks.push(removeTrack);
    }
    res.status(201).json({status: "done", album: removedTracks.reverse()[0], tracks: removedTracks});
    // const { trackID, playlistID } = req.body; // { playlistID, trackID }
    // const removeTrack = await Album.removeTrack(trackID, playlistID);
    // res.status(201).json(removeTrack);
  } catch(err) {
    next(err);
  }
});
