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

// get all universities
router.get('/universities', (req, res) => 
{
    let sql = 'SELECT * FROM universities';
    db.query(sql, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
        res.json(result);    
    });
});

// creates new uni
router.post('/newUniversity',  (req, res) => 
{
    const {name} = req.body;
    let sql = 'INSERT INTO universities (name) VALUES (?)';
    db.query(sql, name ,(err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.json(result);
    });
});

// gets all comments
router.get('/comments', (req, res) => 
{
    let sql = 'SELECT Comments.comment_id, comment_event_id, comments.comment_user_id, comments.message, users.username FROM comments INNER JOIN users ON comments.comment_user_id = users.user_id';
    db.query(sql, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
        res.json(result);    
    });
});

// gets all rsos
router.post('/rsos', (req, res) => {
    const { id, university_id } = req.body;
    let sql = 'SELECT rso_id, rso_name, rso_approved FROM rsos WHERE NOT EXISTS (SELECT rso_member_rso_id FROM rso_members WHERE rsos.rso_id = rso_members.rso_member_rso_id AND rso_member_user_id = ?) AND rso_university_id = ?';
    db.query(sql, [id, university_id], (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.json(result);
    });
});

// get all rsos for the admin
router.post('/adminRsos',  (req, res) => 
{
    const { id } = req.body;
    let sql = 'SELECT rso_id, rso_name, rso_approved FROM rsos WHERE rso_admin_id = ?';
    db.query(sql, id, (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }
        res.json(result);    
    });
});

module.exports = router;