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

// let user w/ id join rso
router.post('/join', (req,res) => {
    const {id, rso_id} = req.body;
    let sql = 'INSERT INTO rso_members (RSO_Member_user_id, RSO_Member_RSO_id) VALUES ( ? , ?)';
    db.query(sql, [id, rso_id], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

// create an rso
router.post('/create', (req,res) => {
    const {name, approved, RSOs_admin_id, RSOs_university_id} = req.body;

    let sql = 'INSERT INTO rsos (name, approved, RSOs_admin_id, RSOs_university_id) VALUES ( ?, ?, ?, ?)';
    db.query(sql, [name, approved, RSOs_admin_id, RSOs_university_id], (err, result) => {
        if (err)
        {   
            return res.status(400).send(err);
        }

        res.json(result);

    });
});

module.exports = router;