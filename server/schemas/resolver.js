const { User } = require("../models/index");

const resolvers = {
  Query: {
    async me(parent, args, contextValue) {
      if (!contextValue.user)
        throw new GraphQLError("you must be logged in to query this schema", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });

      return User.findById(args.id);
    },
  }
};

module.exports = resolvers;
