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
// adds ratings to DB
router.post('/create', (req,res) => {

    const {event_id, user_id, rating} = req.body;

    let sql = 'INSERT INTO ratings (event_id, user_id, rating) VALUES ( ?, ?, ?)';
    db.query(sql, [event_id, user_id, rating], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
    });

    sql = 'SELECT * FROM ratings WHERE \event_id = ? AND user_id = ? AND rating = ?';
    db.query(sql, [event_id, user_id, rating], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// edits a rating in the db
router.post('/edit', (req,res) => {

    const {rating, id, user_id, event_id} = req.body;

    let sql = 'UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ? AND event_id = ?';
    db.query(sql, [rating, id, user_id, event_id], (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// deletes a rating in the db
router.post('/delete', (req,res) => {

    const {id} = req.body;

    let sql = 'DELETE FROM ratings WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

module.exports = router;