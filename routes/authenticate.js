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

// register account
router.post('/register', (req, res) => 
{
    const {username, password, auth_level, uni_id, uni_name} = req.body;

    // Check if both a username and password was sent
    if (!username || !password)
        return res.status(400).json({ msg: 'Please enter username and password'}); 

    let sql = 'INSERT INTO users(username, password, auth_level, uni_id, uni_name) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, password, auth_level, uni_id, uni_name], (err, result) => {
        if (err)
        {
            if (err.code == "ER_DUP_ENTRY")
                return res.status(400).json({ msg: 'username already exists'}); 
            return res.status(400).send(err);
        }

        sql = 'SELECT * FROM users WHERE username =  ?';
        db.query(sql, username, (err, result) => {
            if (err)
            { 
                return res.send(err);
            }

            const user = ({
                "id": result[0].id,
                "username": result[0].username,
                "auth_level": result[0].auth_level,
                "uni_id": result[0].uni_id,
                "uni_name": result[0].uni_name
            });

            res.json({
              user,
              success: true
          }); 
        });

    });

});

//login to account
router.post('/login', (req, res) => 
{
    const {username, password} = req.body;

    // Check if request has both a username and password
    if (username === '' || password ==='')
        return res.status(400).json({ msg: 'Please enter username and password'});

    // Make mySQL query to database -> table: users
    let sql = 'SELECT * FROM users WHERE username =  ?';
    db.query(sql, username, (err, result) => {
        if (err)
        { 
            return res.send(err);
        }

        // Check if empty response indicating no username found

        if (Object.keys(result).length !== 1)
            return res.status(400).json({ msg: 'username not found'});

        // Check if password matches
        if (result[0].password != password)
            return res.status(400).json({ msg: 'Invalid username/password'});

        const user = ({
            "id": result[0].id,
            "username": result[0].username,
            "auth_level": result[0].auth_level,
            "uni_id": result[0].uni_id,
            "uni_name": result[0].uni_name
        });

        res.json({
          user,
          success: true
      });
    });

});

// get user by id
router.get('/users/id/:id', (req,res)=>{
  const id = req.params.id;

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

    res.json({
      user
    });
  });
});

// deny event
//from github event
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

// approves of event
// from github repo
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

// loads events needing admin approval
// from github repo
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
module.exports = router;