const express = require('express');
const router = express.Router();
const config = require('../config/default.json');
const auth =  require('../../middleware/auth');

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
    const {userName, password, auth_level, university_id, university_name} = req.body;

    // Check if both a username and password was sent
    if (!userName || !password)
        return res.status(400).json({ msg: 'Please enter username and password'}); 

    let sql = 'INSERT INTO users(username, password, auth_level, Users_university_id, university_name) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userName, password, auth_level, university_id, university_name], (err, result) => {
        if (err)
        {
            if (err.code == "ER_DUP_ENTRY")
                return res.status(400).json({ msg: 'Username already exists'}); 
            return res.status(400).send(err);
        }

        sql = 'SELECT * FROM users WHERE username =  ?';
        db.query(sql, userName, (err, result) => {
            if (err)
            { 
                return res.send(err);
            }

            const user = ({
                "id": result[0].idUser,
                "username": result[0].username,
                "auth_level": result[0].auth_level,
                "university_id": result[0].Users_university_id,
                "university_name": result[0].university_name
            });

            res.json({
              token,
              user,
              success: true
          }); 
        });

    });

});


// @router POST to api/auth/login
// @desc   Log in to the db
// @access Public
router.post('/login', (req, res) => 
{
    const {userName, password} = req.body;

    // Check if request has both a username and password
    if (userName === '' || password ==='')
        return res.status(400).json({ msg: 'Please enter username and password'});

    // Make mySQL query to database -> table: users
    let sql = 'SELECT * FROM users WHERE username =  ?';
    db.query(sql, userName, (err, result) => {
        if (err)
        { 
            return res.send(err);
        }

        // Check if empty response indicating no username found

        if (Object.keys(result).length !== 1)
            return res.status(400).json({ msg: 'Username not found'});

        // Check if password matches
        if (result[0].password != password)
            return res.status(400).json({ msg: 'Invalid username/password'});

        const user = ({
            "id": result[0].idUser,
            "username": result[0].username,
            "auth_level": result[0].auth_level,
            "university_id": result[0].Users_university_id,
            "university_name": result[0].university_name
        });

        res.json({
          token,
          user,
          success: true
      });
    });

});

module.exports = router;