const express = require('express')
const app = express()
port = 8080

app.get('/', (request, response) => {
    response.send("Test Response")
})

app.listen(port, () => {
    console.log("Server started, listening on Port 8080")
})