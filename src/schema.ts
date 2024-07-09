export const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    hello: String
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`;
