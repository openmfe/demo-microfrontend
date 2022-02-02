const express = require('express')
const cors = require('cors')
const runtime = require('./runtime')
const prerender = require('./prerender')
const semantic = require('./semantic')

const port = process.env.MFE_BACKEND_PORT || 8080
const server = express()
server.use(cors())

const handlers = {
    api : runtime,
    prerender,
    semantic
}

;(async () => {
    server
        .get("/:path", async (req, res) => {
            try {
                if (!handlers[req.params.path])
                    throw new Error("Invalid path.")

                const response = await handlers[req.params.path](req.query)
                res.status(200).send(response)
            } catch (e) {
                console.log(e)
                res.status(500).send(e.message)
            }
        })
})()

server.listen(port, () => console.log(`Server started listening on port ${port}.`))
