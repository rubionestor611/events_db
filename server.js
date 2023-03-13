const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const comments = require('./routes/comments');
const authenticate = require('./routes/authenticate');
const info = require('./routes/info');
const events = require('./routes/events');
const rso = require('./routes/rso');


app.use('/comments', comments);
app.use('/authenticate', authenticate);
app.use('/info', info);
app.use('/events', events);
app.use('/rso', rso);

app.listen(8800, ()=>{
  console.log('Listening on port 8800...');
});