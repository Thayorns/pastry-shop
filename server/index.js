const express = require("express")
const path = require('path')

const PORT = process.env.PORT || 3001

const app = express()

// Have Node serve the files for built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Алчонок! на связи сервер, как слышно, приём!?" })
})

// All other GET requests not handled before will return React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})