const express = require("express")
const path = require('path')
const User = require('./models/User') // Adjust the path as needed
const bcrypt = require('bcrypt')
const pool = require('./db')
const PORT = process.env.PORT || 3001

const app = express()

// Middleware to parse JSON
app.use(express.json())

// Function to connect to PostgreSQL and start the server
const startServer = async () => {
    try {
        await pool.query('SELECT NOW()')
        console.log('PostgreSQL connected')

        // Serve the built React app
        app.use(express.static(path.resolve(__dirname, '../client/build')))

        // Handle GET requests to /api route
        // app.get("/api", (req, res) => {
        //     res.json({ message: "сервер запущен и передаёт данные" })
        // })

        app.get('/api', async (req, res) => {
            try {
                const result = await pool.query('SELECT * FROM postgres');
                res.json(result.rows);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Database query error' });
            }
        })

        // Route to create a new user
        // app.post("/api/users", async (req, res) => {
        //     try {
        //         const { name, email, password } = req.body
        //         const existingUser = await User.findOne({ email })
        //         if (existingUser) {
        //             return res.status(400).json({ error: 'Email already in use' })
        //         }
        //         const newUser = new User({ name, email, password })
        //         await newUser.save()
        //         res.status(201).json(newUser)
        //     } catch (error) {
        //         res.status(500).json({ error: error.message })
        //     }
        // })

        // Route to authenticate a user
        // app.post("/api/login", async (req, res) => {
        //     try {
        //         const { email, password } = req.body
        //         const user = await User.findOne({ email })
        //         if (!user) {
        //             return res.status(400).json({ error: 'Invalid email or password' })
        //         }
        //         const isMatch = await user.comparePassword(password)
        //         if (!isMatch) {
        //             return res.status(400).json({ error: 'Invalid email or password' })
        //         }
        //         res.status(200).json({ message: 'Login successful', user })
        //     } catch (error) {
        //         res.status(500).json({ error: error.message })
        //     }
        // })

        // All other GET requests not handled before will return React app
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
        })

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`)
        })
    } catch (err) {
        console.error('PostgreSQL connection error:', err)
    }
}

// Start the server
startServer()
