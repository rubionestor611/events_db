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

// let user w/ id join rso
router.post('/join', (req,res) => {
    const {user_id, rso_id} = req.body;
    let sql = 'INSERT INTO rso_members (user_id, rso_id) VALUES ( ? , ?)';
    db.query(sql, [user_id, rso_id], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// let user w/ id leave rso
router.post('/leave', (req,res) => {
  const {user_id, rso_id} = req.body;
  let sql = 'DELETE FROM rso_members (user_id, rso_id) WHERE user_id = ? AND rso_id = ?';
  db.query(sql, [user_id, rso_id], (err, result) => {
      if (err) {
          return res.status(400).send(err);
      }

      res.json(result);

  });
});

// create an rso
router.post('/create', (req,res) => {
    const {name, approved, admin_id, uni_id} = req.body;

    let sql = 'INSERT INTO rsos (name, approved, admin_id, uni_id) VALUES ( ?, ?, ?, ?)';
    db.query(sql, [name, approved, admin_id, uni_id], (err, result) => {
        if (err) {   
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

module.exports = router;