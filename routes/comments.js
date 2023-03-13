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
// adds comments to DB
router.post('/create', (req,res) => {

    const {Comments_event_id, Comments_user_id, message} = req.body;

    let sql = 'INSERT INTO comments (comment_event_id, comment_user_id, message) VALUES ( ?, ?, ?)';
    db.query(sql, [Comments_event_id, Comments_user_id, message], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
    });

    sql = 'SELECT * FROM comments WHERE comment_event_id = ? AND comment_user_id = ? AND message = ?';
    db.query(sql, [Comments_event_id, Comments_user_id, message], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// edits a comment in the db
router.post('/edit', (req,res) => {

    const {message, idComment} = req.body;

    let sql = 'UPDATE comments SET message = ? WHERE comment_id = ?';
    db.query(sql, [message, idComment], (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// deletes a comment in the db
router.post('/delete', (req,res) => {

    const {idComment} = req.body;

    let sql = 'DELETE FROM comments WHERE comment_id = ?';
    db.query(sql, idComment, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

module.exports = router;