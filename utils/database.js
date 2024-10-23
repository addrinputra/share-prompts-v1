import mongoose, {mongo} from "mongoose";

let isConnected = false; // track the connection status

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    if (error instanceof mongoose.Error) {
      // Handle specific mongoose errors (e.g., timeout, authentication)
      console.error('Mongoose-specific error:', error);
    }
  }
}

// import mongoose, {mongo} from "mongoose";

// let isConnected = false; // track the connection status

// export const connectToDB = async () => {
//   mongoose.set('strictQuery', true);

//   if (isConnected) {
//     console.log('MongoDB is already connected');
//     return;
//   }

//   try {
//     console.log('Attempting to connect to MongoDB...');
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "share_prompt",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = true;
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.log('MongoDB connection error:', error);
//   }
// }