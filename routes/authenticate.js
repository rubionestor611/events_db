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
// give auth_level = 1 for user and auth_level = 3 for superadmin
router.post('/register/superadmin', (req, res) => 
{
    const {username, password, auth_level} = req.body;

    // Check if both a username and password was sent
    if (!username || !password)
        return res.status(400).json({ msg: 'Please enter username and password'}); 

    
    let sql = 'INSERT INTO users(username, password, auth_level) VALUES (?, ?, ?)';
    db.query(sql, [username, password, auth_level], (err, result) => {
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

// register account
// give auth_level = 1 for user and auth_level = 3 for superadmin
router.post('/register', (req, res) => 
{
    const {username, password, auth_level, uni_id} = req.body;

    // Check if both a username and password was sent
    if (!username || !password)
        return res.status(400).json({ msg: 'Please enter username and password'}); 

    if(!uni_id){
      return res.status(400).json({msg: 'Please select a University to enroll to'});
    }

    let uniquery = 'SELECT name FROM universities WHERE id=?'
    db.query(uniquery, uni_id, (err,result)=>{
      if(err) {
        return res.status(400).send(err);
      }

      const uni_name = result[0].name;
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
});

//login to account
// only needs username and password
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

module.exports = router;