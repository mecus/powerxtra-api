
import express, {NextFunction, Request, Response} from "express";
import { Advert } from "../controllers";

export const AdvertRoutes = express.Router();

AdvertRoutes.post("/adverts/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newAdvert = await Advert.createAdvert(data);
    res.status(201).json(newAdvert);
  }catch(err) {
    next(err);
  }
});
AdvertRoutes.get("/adverts/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listAdverts = await Advert.listAdvert(query);
    res.status(200).json(listAdverts);
  }catch(err) {
    next(err);
  }
});

AdvertRoutes.get("/adverts/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const advert = await Advert.getAdvert(ID);
    res.status(200).json(advert);
  }catch(err) {
    next(err);
  }
});

AdvertRoutes.patch("/adverts/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updateAdvert = await Advert.updateAdvert(ID, data);
    res.status(201).json(updateAdvert);
  }catch(err) {
    next(err);
  }
});
AdvertRoutes.delete("/adverts/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delAdvert = await Advert.deleteAdvert(ID);
    res.status(204).json(delAdvert);
  }catch(err) {
    next(err);
  }
});
AdvertRoutes.delete("/adverts/restore/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const restoreAdvert = await Advert.restoreAdvert(ID);
    res.status(204).json(restoreAdvert);
  }catch(err) {
    next(err);
  }
});

