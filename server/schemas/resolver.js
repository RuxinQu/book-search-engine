const { GraphQLError } = require("graphql");
const { User } = require("../models/index");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user)
        throw new GraphQLError("You must be logged in to query this schema", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });

      return await User.findById(context.user._id).populate("books");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      //check if the email exist
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("No user with this email found");
      }
      //if the email exist, check the passwork
      const checkPw = await user.isCorrectPassword(password);
      if (!checkPw) {
        throw new GraphQLError("Incorrect password");
      }
      //the first time user login, server generates a token
      const token = signToken(user);
      //after login, the server needs to send a new token
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      //create a user and generate a token
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      //after sign in, the server needs to send a new token
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("You need to login!");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args.input } },
        { new: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("You need to login!");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: args.bookId } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
