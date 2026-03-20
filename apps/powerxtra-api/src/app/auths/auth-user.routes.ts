import express, {NextFunction, Request, Response} from "express";
import { User } from "./user-account";
import { checkIfUserExist, FirebaseUser } from "./firebase-account";

export const AuthRoutes = express.Router();

AuthRoutes.post("/auth/create_user", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const userData = req.body; // {name, email, passord}
    const existUser:any = await checkIfUserExist(userData.email);
      // console.log("After Checking", existUser);
      if(existUser){
          // user already exist in the database, no need to create a duplicate
          // const user: any = await User.getOneUser({uid: existUser.uid});
        return res.status(200).json({auth: existUser, status: 'exist'});
      }
    const firebaseUser: any = await FirebaseUser.createUser({
      displayName: userData.displayName,
      email: userData.email,
      password: userData.password
    });
    console.log("Firebase User", firebaseUser);
    if(firebaseUser){
      const claim = await FirebaseUser.createCustomClaim(firebaseUser.uid, {accountType: userData.accountType ?? "general"});
      console.log("Custom Claim:", claim);
      const combUser = {...userData, uid: firebaseUser.uid,
        accoutType: userData.accountType ?? "general" };
      const user = await User.createUser(combUser);
      res.status(201).json(user);
    }else{
      const error = new Error("Failed to create user account");
      return next(error);
    }
  }catch(err){
    next(err);
  }
});

AuthRoutes.post("/auth/create_user_without_auth", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const data = req.body;
    const user = await User.createUser(data);
    res.status(201).json(user);
  }catch(err){
    next(err);
  }
});

AuthRoutes.get("/auth/get_user/:uid", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const UID = req.params.uid;
    const user = await User.getUser(UID);
    res.status(200).json(user);
  }catch(err){
    next(err);
  }
});
AuthRoutes.get("/auth/get_user_by_email/:email", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const email = req.params.email;
    const user = await User.getUserByEmail(email);
    res.status(200).json(user);
  }catch(err){
    next(err);
  }
});

AuthRoutes.get("/auth/list_users", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const query = req.query;
    const users = await User.listUsers(query);
    res.status(200).json(users);
  }catch(err){
    next(err);
  }
});

AuthRoutes.patch("/auth/update_user/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const patchData = req.body;
    const ID = req.params.id;
    const user = await User.updateUser(ID, patchData);
    res.status(201).json(user);
  }catch(err){
    next(err);
  }
});

AuthRoutes.delete("/auth/delete_user/:id", async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ID = req.params.id;
    const user: any = await User.getUser(ID);
    if(user?.uid){
      const delAuth = await FirebaseUser.deleteUser(user.uid);
      console.log("Deleted Auth:", delAuth);
    }
    const deluser = await User.deleteUser(ID);
    res.status(200).json(deluser);
  }catch(err){
    next(err);
  }
});
