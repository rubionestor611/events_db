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

router.get("/all", (req,res)=>{
  let sql = "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id";
  db.query(sql,(err,result)=>{
    if (err)
    {
      return res.status(400).send(err);
    }

    return res.json(result);
  })
});

// adds comments to DB
router.post('/create', (req,res) => {

    const {event_id, user_id, message} = req.body;

    let sql = 'INSERT INTO comments (event_id, user_id, message) VALUES ( ?, ?, ?)';
    db.query(sql, [event_id, user_id, message], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
    });

    sql = 'SELECT * FROM comments WHERE \event_id = ? AND user_id = ? AND message = ?';
    db.query(sql, [event_id, user_id, message], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// edits a comment in the db
router.post('/edit', (req,res) => {

    const {message, id, user_id, event_id} = req.body;

    let sql = 'UPDATE comments SET message = ? WHERE id = ? AND user_id = ? AND event_id = ?';
    db.query(sql, [message, id, user_id, event_id], (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// deletes a comment in the db
router.post('/delete', (req,res) => {

    const {id} = req.body;

    let sql = 'DELETE FROM comments WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// gets all comments related to an event
router.get('/:event_id', (req,res)=>{
  const event_id = req.params.event_id;

  const sql = "SELECT * FROM comments WHERE event_id = ?";
  db.query(sql, event_id, (err,result) => {
    if(err) {
      return res.status(400).send(err);
    }
    res.json(result);
  });
});

module.exports = router;