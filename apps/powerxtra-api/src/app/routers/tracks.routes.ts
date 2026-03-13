
import express, {NextFunction, Request, Response} from "express";
import { Track } from "../controllers";
import { ITrack } from "../interfaces";

export const TrackRoutes = express.Router();

TrackRoutes.post("/tracks/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newTrack = await Track.createTrack(data);
    res.status(201).json(newTrack);
  }catch(err) {
    next(err);
  }
});
TrackRoutes.get("/tracks/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listTrack: Array<ITrack> | any = await Track.listTracks(query);
    res.status(200).json(listTrack.reverse());
  }catch(err) {
    next(err);
  }
});

TrackRoutes.get("/tracks/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const track = await Track.getTrack(ID);
    res.status(200).json(track);
  }catch(err) {
    next(err);
  }
});

TrackRoutes.patch("/tracks/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updateTrack = await Track.updateTrack(ID, data);
    res.status(201).json(updateTrack);
  }catch(err) {
    next(err);
  }
});
TrackRoutes.delete("/tracks/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const track = await Track.deleteTrack(ID);
    res.status(204).json(track);
  }catch(err) {
    next(err);
  }
});
