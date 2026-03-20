
import express, {NextFunction, Request, Response} from "express";
import { News } from "../controllers";

export const NewsRoutes = express.Router();

NewsRoutes.post("/news/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newNews = await News.createNews(data);
    res.status(201).json(newNews);
  }catch(err) {
    next(err);
  }
});
NewsRoutes.get("/news/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query || {};
    const listNews = await News.listNews(query);
    res.status(200).json(listNews);
  }catch(err) {
    next(err);
  }
});

NewsRoutes.get("/news/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const news = await News.getNews(ID);
    res.status(200).json(news);
  }catch(err) {
    next(err);
  }
});

NewsRoutes.patch("/news/update/:id", async(req: Request, res: Response, next: NextFunction) => {
   try{
    const data = req.body;
    const ID = req.params.id;
    const updateNews = await News.updateNews(ID, data);
    res.status(201).json(updateNews);
  }catch(err) {
    next(err);
  }
});
NewsRoutes.delete("/news/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delNews = await News.deleteNews(ID);
    res.status(204).json(delNews);
  }catch(err) {
    next(err);
  }
});
NewsRoutes.delete("/news/restore/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const restored = await News.restoreNews(ID);
    res.status(204).json(restored);
  }catch(err) {
    next(err);
  }
});

