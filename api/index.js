const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require('./models/User')
const app = express();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = 'aaasnnnncsdsiyyttttwwwhhhcscb';
const cookieParser = require('cookie-parser');

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.REACT_APP_MONGO_SERVER);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc);
    }
    catch (e) {
        res.status(400).json(e);
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
        jwt.sign({ username, id: userDoc._id, secret }, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(ok);
        })
    }
    else {
        res.status(400).json("Wrong Credentials");
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json("ok");
})

app.listen(4000);
