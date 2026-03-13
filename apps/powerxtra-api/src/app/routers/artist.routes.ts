
import express, {NextFunction, Request, Response} from "express";
import { Artist } from "../controllers";

export const ArtistRoutes = express.Router();

ArtistRoutes.post("/artist/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newArtist = await Artist.createArtist(data);
    res.status(201).json(newArtist);
  }catch(err) {
    next(err);
  }
});
ArtistRoutes.get("/artist/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listArtist = await Artist.listArtist(query);
    res.status(200).json(listArtist);
  }catch(err) {
    next(err);
  }
});

ArtistRoutes.get("/artist/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const artist = await Artist.getArtist(ID);
    res.status(200).json(artist);
  }catch(err) {
    next(err);
  }
});

ArtistRoutes.patch("/artist/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updateArtist = await Artist.updateArtist(ID, data);
    res.status(201).json(updateArtist);
  }catch(err) {
    next(err);
  }
});
ArtistRoutes.delete("/artist/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delArtist = await Artist.deleteArtist(ID);
    res.status(204).json(delArtist);
  }catch(err) {
    next(err);
  }
});

