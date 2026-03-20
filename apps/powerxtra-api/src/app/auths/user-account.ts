
import { UserModel } from "../models";
import { IUser } from "../interfaces";

export class User {

  static createUser(userData: any) {

    return new Promise(async(resolve, reject) => {
      try{
        const newUser = new UserModel(userData);
        console.log(newUser)
        const savedUser = await newUser.save();
        resolve(savedUser);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static getUser(UID: string) {

    return new Promise(async(resolve, reject) => {
      try{
        const User = await UserModel.findOne({uid: UID});
        resolve(User);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static getUserByEmail(email: string) {

    return new Promise(async(resolve, reject) => {
      try{
        const User = await UserModel.findOne({email: email});
        resolve(User);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static listUsers(query: any) {

    return new Promise(async(resolve, reject) => {
      try{
        const Users = await UserModel.find(query);
        resolve(Users);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static updateUser(ID: string, patch: IUser) {

    return new Promise(async(resolve, reject) => {
      try{
        const updateUser = await UserModel.updateOne({_id: ID}, patch);
        resolve(updateUser);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
  static deleteUser(ID: string) {

    return new Promise(async(resolve, reject) => {
      try{
        const delUser = await UserModel.deleteOne({_id: ID});
        resolve(delUser);
      }catch(err){
        resolve({error: err, status: "error"});
      }
    });
  }
}
