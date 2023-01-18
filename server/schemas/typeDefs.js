const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }
  type Book{
    authors: [String]
    description: String
    bookID: String
    image: String
    link: String
    title: String
  }

  input Book{
    authors: [String]
    description: String
    bookID: String
    image: String
    link: String
    title: String
  }

  type Auth{
    token: ID!
    user: User
  }

  type Query {
    me(id: ID!): User
  }
  type Mutation {
    login(email: String!, password: String! ): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: Book): User
    removeBook(bookId: String!): User
  }

`;

module.exports = typeDefs;
