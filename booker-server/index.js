require("dotenv").config()
const { WebSocketServer } = require("ws")
const { useServer } = require("graphql-ws/lib/use/ws")
const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const express = require("express")
const cors = require("cors")
const http = require("http")
const mongoose = require("mongoose")
const User = require("./models/user")
const jwt = require("jsonwebtoken")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")

mongoose.set("strictQuery", false)

console.log("connecting to:", process.env.MONGODB_URI)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to MongoDB"))
    .catch((error) =>
        console.log("error in connecting to MongoDB:", error.message),
    )

const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/",
    })
    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })
    await server.start()
    app.use(
        "/",
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const auth = req ? req.headers.authorization : null
                if (auth && auth.startsWith("Bearer ")) {
                    const decodedToken = jwt.verify(
                        auth.substring(7),
                        process.env.JWT_SECRET,
                    )
                    const currentUser = await User.findById(decodedToken.id)
                    return { currentUser }
                }
            },
        }),
    )
    const PORT = process.env.PORT
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}`),
    )
}
start()
