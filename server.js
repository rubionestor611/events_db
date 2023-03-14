const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())
const comments = require('./routes/comments');
const authenticate = require('./routes/authenticate');
const info = require('./routes/info');
const events = require('./routes/events');
const rsos = require('./routes/rsos');
const ratings = require('./routes/ratings');
const locations = require('./routes/locations');
const universities = require('./routes/universities');

app.use('/authenticate', authenticate);
app.use('/comments', comments);
app.use('/events', events);
app.use('/info', info);
//app.use('/locations',locations);
app.use('/ratings',ratings);
app.use('/rsos', rsos);
app.use('/universities', universities);

app.listen(8800, ()=>{
  console.log('Listening on port 8800...');
});