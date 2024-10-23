import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

console.log({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  async session({session}) {
    // const sessionUser = await User.findOne({
    //   email: session.user.email
    // })

    // session.user.id = sessionUser._id.toString();

    // return session;
    try {
      await connectToDB();  // Ensure the database is connected
      const sessionUser = await User.findOne({
        email: session.user.email 
      }); 

      if (!sessionUser) {
        throw new Error("User not found");
      }

      session.user.id = sessionUser._id.toString();
      return session;
    } catch (error) {
      console.error('Error in session callback:', error);
      return session;
    }
  },
  async signIn({profile}) {
    try {
      // serverless -> Lambda -> dynamodb (opens ip only when it gets called)
      await connectToDB();

      // check if a user already exist
      const userExist = await User.findOne({
        email: profile.email
      });

      // if not, create a new user
      if (!userExist) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture
        })
      }

      return true;
    } catch (error) {
      console.error("Error in signIn callback:", error);
      return false;
    }
  },
  pages: {
    error: '/auth/error', // Redirect users to an error page if something goes wrong
  },
});

export { handler as GET, handler as POST };