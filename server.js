require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')

const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/blogs', require('./routes/blogRoutes'))
app.use('/recipes', require('./routes/recipeRoutes'))
app.use('/dash', require('./routes/dashRoutes'))
app.use('/profile', require('./routes/profileRoutes'))
app.use('/categories', require('./routes/categoryRoutes'))
app.use('/api', require('./routes/chat-routes'))


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// const server = mongoose.connection.once('open', () => {
    // console.log('Connected to MongoDB')
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// })

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://chefbook.onrender.com",
      credentials: true, 
    },
  });
  
  let activeUsers = [];
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
  
    socket.on("setup", (userData) => {
      socket.join(userData.id);
      socket.emit("connected");
    });
  
    //online users başlangıç
    socket.on("new-active-user", (newUserId) => {
      if (!activeUsers.some((users) => users._id === newUserId)) {
        activeUsers.push({
          _id: newUserId,
          socketId: socket.id,
        });
      }
      console.log("active Users", activeUsers);
      io.emit("all-active-users", activeUsers);
    });
  
    socket.on("disconnected-user", (userId) => {
      activeUsers = activeUsers.filter((users) => users._id !== userId);
      console.log("user disconnected, active users", activeUsers);
      io.emit("all-active-users", activeUsers);
    });
    //online users bitiş
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
  
    socket.on("typing", (room, typingUserId) => {
      socket.in(room).emit("typing", room, typingUserId);
      // console.log(typingUserId);
    });
  
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      let chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", (userData) => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });