const express = require('express');
const router = express.Router();
const config = require('../config/default.json');

const mySql = require('mysql');

// Setup connection
const db = mySql.createConnection({
  host  : "localhost",
  user : "root",
  password : "",
  database : "events"
});

// gets public events at university
router.post('/public', (req,res) => {
    const {university_id} = req.body;

    let sql = 'SELECT event_id, event_name AS eventName, category, description, event_time, event_date, location, phone, email, rating, numRatings, scoreRatings, rso_name FROM events INNER JOIN rsos ON events.event_rso_id = rsos.rso_id WHERE status = "public" AND event_uni_id = ?';
    db.query(sql, university_id, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// loads public events
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

// loads public and private events
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
router.post('/create', (req,res) => {

    const {name, category, description, time, date, location, phone, email, status, Events_university_id, Events_RSO_id, Events_admin_id, approved} = req.body;

    // console.log("ROUTE:" + name, category, description, time, date, location, phone, email, status, Events_university_id, Events_RSO_id, Events_admin_id);

    let sql = 'INSERT INTO events (name, category, description, time, date, location, phone, email, status, event_uni_id, event_rso_id, event_admin_id, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, category, description, time, date, location, phone, email, status, Events_university_id, Events_RSO_id, Events_admin_id, approved], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

router.post('/checkTime', (req,res) => {

    const {university, location, date, time} = req.body;

    let sql = 'SELECT COUNT(*) as count FROM events WHERE (event_uni_id = ? AND location = ? AND date = ? AND time = ?)';
    db.query(sql, [university, location, date, time], (err, result) => {
        res.json(result[0].count);

    });
});



// loads events needing admin approval
router.post('/getUnapprovedEvents', (req, res) => {
    const { university_id } = req.body;

    let sql = 'SELECT event_id, event_name AS eventName, category, description, time, event_date, location, phone, email, rating, numRatings, scoreRatings, rso_name FROM events INNER JOIN rsos ON events.event_rso_id = rsos.rso_id WHERE events.approved = 0 AND events.event_uni_id = ?';
    db.query(sql, university_id, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// approves of event
router.post('/approveEvent', (req, res) => {
    const { idEvent } = req.body;

    let sql = 'UPDATE events SET approved = 1 WHERE event_id = ?';
    db.query(sql, idEvent, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// denies an event
router.post('/denyEvent', (req, res) => {
    const { idEvent } = req.body;

    let sql = 'DELETE FROM events WHERE event_id = ?';
    db.query(sql, idEvent, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

module.exports = router;