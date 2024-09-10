import mongoose from "mongoose";

const connectDb = async (uri) => {
    return mongoose.connect(uri, {dbName : "Luganodes-API"
    }).then(() => {
      console.log('Connected to Database Successfully');
    }).catch((error) => {
      console.log(error);
    })
  }

export default connectDb;