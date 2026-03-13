
import express, {NextFunction, Request, Response} from "express";
import { Playlist } from "../controllers";

export const PlaylistRoutes = express.Router();

PlaylistRoutes.post("/playlist/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newPlaylist = await Playlist.createPlaylist(data);
    res.status(201).json(newPlaylist);
  }catch(err) {
    next(err);
  }
});
PlaylistRoutes.get("/playlist/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listPlaylist = await Playlist.listPlaylists(query);
    res.status(200).json(listPlaylist);
  }catch(err) {
    next(err);
  }
});

PlaylistRoutes.get("/playlist/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const playlist = await Playlist.getPlaylist(ID);
    res.status(200).json(playlist);
  }catch(err) {
    next(err);
  }
});

PlaylistRoutes.patch("/playlist/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updatePlaylist = await Playlist.updatePlaylist(ID, data);
    res.status(201).json(updatePlaylist);
  }catch(err) {
    next(err);
  }
});
PlaylistRoutes.delete("/playlist/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delPlaylist = await Playlist.deletePlaylist(ID);
    res.status(204).json(delPlaylist);
  }catch(err) {
    next(err);
  }
});
PlaylistRoutes.post("/playlist/add_track", async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { trackID, playlistID } = req.body; // { playlistID, trackID }
    const addTrack = await Playlist.addTrack(trackID, playlistID);
    res.status(201).json(addTrack);
  } catch(err) {
    next(err);
  }
});
PlaylistRoutes.post("/playlist/remove_track", async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { trackID, playlistID } = req.body; // { playlistID, trackID }
    const removeTrack = await Playlist.removeTrack(trackID, playlistID);
    res.status(201).json(removeTrack);
  } catch(err) {
    next(err);
  }
});
