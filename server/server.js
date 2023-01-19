const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

//use the @apollo/server package for apollo server v4
const { ApolloServer } = require("@apollo/server");
// The expressMiddleware function enables you to attach Apollo Server to an Express server.
// The expressMiddleware function expects you to set up HTTP body parsing and CORS headers for your web framework.
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");

const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { resolvers, typeDefs } = require("./schemas/index");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer, enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin for our httpServer.
const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async () => {
  await server.start();
  app.use(
    "/",
    cors(),
    bodyParser.json(),
    // For Apollo server 4: expressMiddleware accepts the same arguments: an Apollo Server instance and optional configuration options
    // add authmiddleware as context, persist the request
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );
  db.once("open", async () => {
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
};

startApolloServer();
