const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const cors = require('cors');

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversation')
const messageRoute = require('./routes/message')
const process = require('process')

const app = express()

dotenv.config()

mongoose.connect(
    "mongodb+srv://Zeta:thuan2002@cluster0.pmjo1.mongodb.net/Zeta?retryWrites=true&w=majority",
    { useNewUrlParser: true },
    () => {
        console.log('Connected to MongoDB...')
    }
)

app.use("/images", express.static(path.join(__dirname, "public/images")))

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors());
// app.use(cors({origin: process.env.CLIENT_URL}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})
const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully!")
    }
    catch (err) {
        console.log(err)
    }
})

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)

app.get("/", (req, res) => {
    res.send("Zeta API v2...")
})

app.get("/health", (req, res) => {
    res.json({})
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.listen(process.env.PORT || 8800 , () => {
    console.log("Backend server is running...")
})
