const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(express.json())

app.get('/ping', (req, res) => {
    res.status(200).send('pong')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log(`Backend running on http://localhost:${PORT}`)
})