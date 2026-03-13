import * as admin from "firebase-admin";
import { environment } from "../../../../../environments/environment";
import { serviceAccount } from "../../../../../environments/firebase-config";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: environment.production? "https://allmembers-prod-default-rtdb.firebaseio.com":"https://allmembers.firebaseio.com"
});
export { admin };

// a15495966c8dcafcdbc0b39f923cc5cdfe569295
