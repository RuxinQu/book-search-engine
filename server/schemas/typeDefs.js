const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }
  type Book{
    authors: String
    description: String
    bookID: String
    image: String
    link: String
    title: String
  }
  type Query {
    me(id: ID!): User
  }

`;

module.exports = typeDefs;
