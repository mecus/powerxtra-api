import { connect } from 'mongoose';

export const dbconfig = () => {
  const db_username = process.env.DB_USERNAME;
  const db_password = process.env.DB_PASSWORD;
  const db_name = process.env.DB_NAME;
   const dbCluster = process.env.MONGODB_CLUSTER
  return {
      name: db_name,
      url: `mongodb+srv://${db_username}:${db_password}${dbCluster}/${db_name}?retryWrites=true&w=majority`
  };
};


export class Database {
  static connect_url = dbconfig().url;
  static db_name = dbconfig().name;
  static start() {
    // Connect to MongoDB
    connect(`${this.connect_url}`).then((connection) => {
      console.log("Database Connected")
      // console.log(connection)
    }).catch((err) => {
      console.log(err);
    })

  }
}



