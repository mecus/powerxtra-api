import { admin } from "../configurations/admin.config";
import { SuccessResponse, ErrorResponse } from "../utils/request-response";

export class FirebaseUser {

  static createUser(user: any) {
    // console.log(user);
      return new Promise((resolve, reject) => {
          admin.auth().createUser(user).then((user: any) => {
              resolve(user);
          }).catch((err: any) => {
            reject(err);
          });
      });
  }
  static getUserById(uId: string) {
    return new Promise((resolve, reject) => {
      admin.auth().getUser(uId).then((userRecord: any) => {
        console.log(userRecord);
        resolve(userRecord);
      }).catch((err: any) => {
        console.log(err);
        reject(err);
      });
    });
  }
  static getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      admin.auth().getUserByEmail(email).then((userRecord: any) => {
        resolve(userRecord);
      }).catch((err: any) => {
        console.log(err);
        resolve(null);
      });
    });
  }
  static getUsers(limit: number) {
    return new Promise((resolve, reject) => {
      admin.auth().listUsers(limit).then((users: any) => {
          resolve(users.users);
      }).catch((err: any) => reject(err));
    });
  }
  static createCustomClaim(uId: any, claims: any) {
    return new Promise((resolve, reject) => {
      admin.auth().setCustomUserClaims(uId, claims)
      .then(() => {
        resolve({status: "claim created"});
      }).catch((err: any) => resolve({status: "claim failed"}));
    });
  }
  static verifyToken(idToken: string) {
    return new Promise((resolve, reject) => {
      admin.auth().verifyIdToken(idToken).then((user: any) => {
        resolve(user);
      }).catch((err: any) => reject(err));
    });
  }
  // static verifyTokenAndAppAccess(context: any) {
  //   // console.log(context);
  //   return new Promise((resolve, reject) => {
  //     admin.auth().verifyIdToken(context.token).then((user: any) => {
  //       const claims = user;
  //       // console.log(claims);
  //       if (claims.app === context.app && claims.appId === context.appId) {
  //         console.log(`GRANTED: ${claims.uid} : ${claims.app} : Admin=${claims.admin}`);
  //         return resolve({access: true, admin: claims.admin});
  //       }
  //       console.log(`REFUSED: ${claims.uid} : ${claims.app} : Admin=${claims.admin}`);
  //       return resolve({access: false, admin: claims.admin});
  //     }).catch((err: any) => reject(err));
  //   });
  // }

  static updateUserAccountType(uId: string, accountType: string){
    return new Promise(async(resolve, reject) => {
      try{
        const user: any = await FirebaseUser.getUserById(uId);
        const newClaim = {...user.customClaims, accountType: accountType};
        await admin.auth().setCustomUserClaims(uId, newClaim);
        resolve({status: "success", updated: true});
      }catch(err: any) {
        resolve({status: "error", error: err.message, updated: false});
      }
    });
  }
  static updateUser(uid: string, patch: any) {
    return new Promise(async(resolve, reject) => {
      try{
        const userRecord = await admin
          .auth()
          .updateUser(uid, patch
          //   {
          //   email: 'modifiedUser@example.com',
          //   phoneNumber: '+11234567890',
          //   emailVerified: true,
          //   password: 'newPassword',
          //   displayName: 'Jane Doe',
          //   photoURL: 'http://www.example.com/12345678/photo.png',
          //   disabled: true,
          // }
          );
          console.log(userRecord)
          resolve({update: true, user: userRecord});

      }catch(err) {
        reject(err);
      }
    });
  }
  static updateUserPassword(uid: string, update: any) {
    return new Promise((resolve, reject) => {
      admin.auth().updateUser(uid, update).then((res: any) => {
        resolve(SuccessResponse(res, "object"));
      }).catch((err: any) => {
        resolve(ErrorResponse(err));
      });
    });
  }

  static createCustomToken(uid: string) {
    return new Promise((resolve, reject) => {
      admin.auth().createCustomToken(uid).then((token: string) => {
        resolve(token);
      }).catch((err: any) => reject(err));
    });
  }
  static deleteUser(uid: string){
    return new Promise(async(resolve, reject) => {
      // first delete all user dependencies
      // database entry
      // remove user from associated app
      try{
        const user = await admin.auth().getUser(uid);
        // console.log(user)
        if(user){
          const delUser = await admin.auth().deleteUser(uid);
          // console.log("Fb-Del", delUser)
          resolve({status: "success", deleted: true, uid: uid, delUser});
        }else{
          throw new Error("Unable to locate firebase user account");
        }
      } catch(err) {
        reject(err);
      }

    });
  }

}
export function checkIfUserExist(email: string){
    return new Promise((resolve, reject) => {
      FirebaseUser.getUserByEmail(email).then(user => {
            if(user){
                resolve(user);
            }else{
                resolve(null);
            }
        }).catch(err => {
            // console.log("NO USE ERR:", err);
            resolve(null);
        });
    });
}
export const checkUserAuthorization = (user: any, role: string, bypass = false) => {
    // const role: string = "admin";
    // not in user and incomplete code
    if(bypass) return true;
    const pass =  true;//Auth0.authorization(user, role);
    if(pass) return true;
        throw new Error("Unauthorized access to this resource");
}


  // static createUserSession(context: any){
  //   return new Promise((resolve, reject) => {
  //     try{
  //       const db = admin.database();
  //       const userRef = db.ref("/sessions/"+context.uid);
  //       const pushSession = userRef.push();
  //       const session = pushSession.set({...context, uid: null, id: pushSession.key});
  //       resolve({session, id: pushSession.key, uid: context.uid});
  //     }catch(err){
  //       console.error(err);
  //       reject(null);
  //     }
  //   });
  // }
  // static getUserSession(context: any){
  //   return new Promise((resolve, reject) => {
  //     try{
  //       const db = admin.database();
  //       const userRef = db.ref("/sessions/"+context.uid);
  //       userRef.orderByChild('ip').equalTo(context.ip).once('value', (snapshot) => {
  //         const sess: any[] = [];
  //         snapshot.forEach((data: any) => {
  //           sess.push({id: data.key, ...data.val()});
  //         })
  //         // console.log("CuRR SeSS:", sess)
  //         resolve(sess);
  //       });
  //     }catch(err){
  //       console.error(err);
  //       reject(null);
  //     }
  //   });
  // }
  // static deleteUserSessions(context: any){
  //   return new Promise((resolve, reject) => {
  //     try{
  //       const db = admin.database();
  //       const userRef = db.ref("/sessions/"+context.uid);
  //       userRef.orderByChild('ip').equalTo(context.ip).once('value', (snapshot) => {
  //         const sessDel: any[] = [];
  //         snapshot.forEach((data: any) => {
  //           const sessionRef = db.ref("/sessions/"+context.uid+"/"+data.key);
  //           const delRef = sessionRef.set(null).then(res => res);
  //           sessDel.push(delRef);
  //         })
  //         // console.log("Delete SeSS:", sessDel)
  //         resolve(sessDel);
  //       });
  //     }catch(err){
  //       console.error(err);
  //       reject(null);
  //     }
  //   });
  // }
