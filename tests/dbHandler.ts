import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongodb = new MongoMemoryServer();
(async () => {
  const uri = await mongodb.getConnectionString();
  console.log(uri);
})();

const connect = async () => {
  const uri = await mongodb.getConnectionString();

  const mongooseOpts: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
  };

  await mongoose.connect(process.env.MONGO_URL, mongooseOpts);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(uri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${uri}`);
  });
};

const close = async () => {
  await mongoose.connection.dropCollection("blogs");
  await mongoose.connection.close();
  await mongodb.stop();
};

const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const [key, collection] of Object.entries(collections)) {
    await collection.deleteMany({});
  }
};

const dbHandler = { connect, close, clear };

export default dbHandler;
