require('dotenv').config()
const express = require('express');
const corn = require('node-cron');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

var job = false

app.get('/', (req, res) => {

    console.log('Cron Job Started')
    corn.schedule('* * * * *', ()=> {
        logTime()
    })
    const token = jwt.sign('sampleToke', process.env.secret)
    res.status(200).json({'Cron Job': 'Started', 'Access Token': token})
})

app.get('/verify', authenticationToken, (req, res) => {
    res.status(200).json({"Authentication Token": 'Verified'})
})

function authenticationToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];
    if(token == null) return res.status(404).json({"Authentication Token": 'Not Found'});

    jwt.verify(token, process.env.secret, (err, data) => {
        if(err) return res.status(401).json({"Authentication Token": 'Unauthorized'});
        next()
    })
}

function logTime(){
    let today = new Date(Date.now()).toUTCString()
    console.log('The date and time is now ' + today )
}

app.listen(3001, ()=>{
    console.log('server started')
})
