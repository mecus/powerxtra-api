
import express, {NextFunction, Request, Response} from "express";
import { Programme } from "../controllers";

export const ProgrammeRoutes = express.Router();

ProgrammeRoutes.post("/programmes/create", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const newProgramme = await Programme.createProgramme(data);
    res.status(201).json(newProgramme);
  }catch(err) {
    next(err);
  }
});

ProgrammeRoutes.get("/programmes/list", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.query;
    const Programmes = await Programme.listProgramme(data);
    res.status(201).json(Programmes);
  }catch(err) {
    next(err);
  }
});

ProgrammeRoutes.get("/programmes/get/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const programme = await Programme.getProgramme(ID);
    res.status(201).json(programme);
  }catch(err) {
    next(err);
  }
});

ProgrammeRoutes.patch("/programmes/update/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const patch = req.body;
    const updateProgramme = await Programme.updateProgramme(ID, patch);
    res.status(201).json(updateProgramme);
  }catch(err) {
    next(err);
  }
});
ProgrammeRoutes.delete("/programmes/delete/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const delProgramme = await Programme.deleteProgramme(ID);
    res.status(201).json(delProgramme);
  }catch(err) {
    next(err);
  }
});
