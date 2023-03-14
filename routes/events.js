const express = require('express');
const router = express.Router();

const mySql = require('mysql');

// Setup connection
const db = mySql.createConnection({
  host  : "localhost",
  user : "root",
  password : "",
  database : "events"
});

// get event by id
router.get('/id/:id', (req,res)=>{
  const id = req.params.id;

  const sql = "SELECT * FROM events WHERE id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.send(err);
    }

    if (Object.keys(result).length !== 1)
      return res.status(400).json({ msg: 'id not found'});

    const event = ({
      "id": result[0].id,
      "name": result[0].name,
      "category": result[0].category,
      "description": result[0].description,
      "time": result[0].time,
      "date": result[0].date,
      "location_id": result[0].location_id ,
      "location": result[0].location ,
      "phone": result[0].phone ,
      "email": result[0].email ,
      "status": result[0].status ,
      "rating": result[0].rating ,
      "approved": result[0].approved ,
      "numRatings": result[0].numRatings ,
      "scoreRatings": result[0].scoreRatings ,
      "uni_id": result[0].uni_id ,
      "rso_id": result[0].rso_id ,
      "admin_id": result[0].admin_id
    });

    res.json({
      event
    });
  });
});

// get all items public, in user's uni, and in user's rso
router.get('/visible/:id', (req,res)=>{
    const userID = req.params.id;

    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, id, (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (Object.keys(result).length !== 1)
        return res.status(400).json({ msg: 'id not found'});

      const user = ({
        "id": result[0].id,
        "username": result[0].username,
        "auth_level": result[0].auth_level,
        "uni_id": result[0].uni_id,
        "uni_name": result[0].uni_name
      });

      // select all public events and uni_ids, pass in users uni_id
      const sql = 'SELECT events.id,  rsos.name, rsos.id, events.name AS eventName, events.approved, events.uni_id, events.status, category, description, time, events.date, location, phone, email, rating, numRatings, scoreRatings, rso_members.user_id FROM events INNER JOIN rso_members ON events.rso_id = rso_members.rso_id AND rso_members.user_id = ? INNER JOIN rsos ON events.rso_id = rsos.id AND events.uni_id = ? AND events.approved = 1 GROUP BY id UNION SELECT id,  rsos.name, rsos.id, events.name AS eventName, events.approved, events.uni_id, events.status, category, description, time, events.date, location, phone, email, rating, numRatings, scoreRatings, rso_members.user_id FROM events, rso_members, rsos WHERE events.rso_id = rsos.id AND (events.uni_id = ? AND events.approved = 1 AND events.status = "public") GROUP BY id';//"SELECT * FROM events WHERE status='Public' UNION SELECT * FROM events WHERE uni_id = ? SELECT * FROM events INNER JOIN rsos ON ";
      
      db.query(sql, [user.id, user.uni_id, user.uni_id], (err,result)=>{
        if (err) {
          return res.send(400).send(err);
        }

        res.json(result);
      })
    });
})

// gets public events at university
// from one of github repos
router.post('/public', (req,res) => {
    const {university_id} = req.body;

    let sql = 'SELECT events.id, events.name AS eventName, category, description, event_time, event_date, location, phone, email, rating, numRatings, scoreRatings, rsos.name FROM events INNER JOIN rsos ON events.rso_id = rsos.id WHERE status = "public" AND events.uni_id = ?';
    db.query(sql, university_id, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// from one of github repos
router.post('/rating', (req,res) => {
    const {idEvent, rating, numRatings, scoreRatings} = req.body;

    let sql = 'UPDATE events SET rating = ?, numRatings = ?, scoreRatings = ? WHERE event_id = ?';
    db.query(sql, [rating, numRatings, scoreRatings, idEvent], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// loads public and private eventS
// from one of github repos
router.post('/private', (req,res) => {
    
    const {university_id} = req.body;

    let sql = 'SELECT * FROM events WHERE status = "public" OR status = "private" AND event_uni_id = ?';
    db.query(sql, university_id, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// loads public, private, and RSO events
// from one of github repos
router.post('/rso', (req,res) => {
    const { idUser, university_id } = req.body;

    let sql = 'SELECT event_id,  rsos.rso_name, rsos.rso_id, events.event_name AS eventName, events.approved, event_uni_id, events.status, category, description, time, events.event_date, location, phone, email, rating, numRatings, scoreRatings, rso_member_user_id FROM events INNER JOIN rso_members ON events.event_rso_id = rso_members.rso_member_rso_id AND rso_member_user_id = ? INNER JOIN rsos ON events.event_rso_id = rsos.rso_id AND event_uni_id = ? AND events.approved = 1 GROUP BY event_id UNION SELECT event_id,  rsos.rso_name, rsos.rso_id, events.event_name AS eventName, events.approved, event_uni_id, events.status, category, description, time, events.event_date, location, phone, email, rating, numRatings, scoreRatings, rso_member_user_id FROM events, rso_members, rsos WHERE events.event_rso_id = rsos.rso_id AND (events.event_uni_id = ? AND events.approved = 1 AND events.status = "public") GROUP BY event_id';
    db.query(sql, [idUser, university_id, university_id], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// creates event
//from one of github repos
router.post('/create', (req,res) => {

    const {name, category, description, time, date, location_id,location, phone, email, status, rating, approved, numRatings, scoreRatings, uni_id, rso_id, admin_id} = req.body;

    // console.log("ROUTE:" + name, category, description, time, date, location, phone, email, status, Events_university_id, Events_RSO_id, Events_admin_id);

    let sql = 'INSERT INTO events (name, category, description, time, date, location, phone, email, status, event_uni_id, event_rso_id, event_admin_id, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)';
    db.query(sql, [name, category, description, time, date, location_id,location, phone, email, status, rating, approved, numRatings, scoreRatings, uni_id, rso_id, admin_id], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// from one of github repos
router.post('/checkTime', (req,res) => {

    const {university, location, date, time} = req.body;

    let sql = 'SELECT COUNT(*) as count FROM events WHERE (event_uni_id = ? AND location = ? AND date = ? AND time = ?)';
    db.query(sql, [university, location, date, time], (err, result) => {
        res.json(result[0].count);

    });
});

module.exports = router;