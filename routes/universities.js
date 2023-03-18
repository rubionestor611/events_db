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

// only superadmins can do this
router.post('/create', (req,res)=>{
  const {name,description,super_admin_id} = req.body;
  
  
  let sql = "INSERT INTO universities (name,description,super_admin_id) VALUES (?,?,?)";

  db.query(sql, [name,description,super_admin_id], (err,result) => {
    if (err) {
        if (err.code == "ER_DUP_ENTRY")
            return res.status(400).json({ msg: 'university name already exists'}); 
        return res.status(400).send(err);
    }
    
    sql = "SELECT * FROM universities WHERE name = ?";
    db.query(sql, name, (err,result) => {
      if (err) { 
          return res.send(err);
      }

      const university = ({
        "id": result[0].id,
        "name": result[0].name,
        "description": result[0].description,
        "super_admin_id": result[0].super_admin_id
      });

      res.json({university, success:true});
    });
  })
});

// get all universites info
router.get('/', (req,res)=>{
  const sql = "SELECT * FROM universities";
  db.query(sql,(err,result)=>{
    const universities = [];
    for(let i = 0; i < Object.keys(result).length; i++){
      universities.push(({
        "id": result[i].id,
        "name": result[i].name,
        "description": result[i].description,
        "super_admin_id": result[i].super_admin_id
      }));
    }

    res.json({universities, success:true});
  })
});

// get uni by id
router.get('/universities/id/:id', (req,res)=>{
  const id = req.params.id;

  const sql = "SELECT * FROM universities WHERE id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.send(err);
    }

    if (Object.keys(result).length !== 1)
      return res.status(400).json({ msg: 'id not found'});

    const university = ({
      "id": result[0].id,
      "name": result[0].name,
      "description": result[0].description,
      "super_admin_id": result[0].super_admin_id
    });

    res.json({
      university
    });
  })
});

// delete a university by id
router.post('/delete/:id', (req,res) => {
  const id = req.params.id;

  let sql = 'DELETE FROM universities WHERE id = ?'
  db.query(sql,id,(err,result) => {
    if(err) {
      return res.send(err)
    }
    // DELETE ALL USERS/events/rsos WHOS UNI IS THE UNI BEING DELETED
    sql = "DELETE FROM users WHERE uni_id = ?";
    db.query(sql,id);
    sql = "DELETE FROM events WHERE uni_id = ?";
    db.query(sql,id);
    sql = "DELETE FROM rsos WHERE uni_id = ?";
    db.query(sql,id);
    sql = "SELECT * FROM universities";
    db.query(sql,(err,result)=>{
      const universities = [];
      for(let i = 0; i < Object.keys(result).length; i++){
        universities.push(({
          "id": result[i].id,
          "name": result[i].name,
          "description": result[i].description,
          "super_admin_id": result[i].super_admin_id
        }));
      }

      res.json({universities, success:true});

    });
  });
});

module.exports = router;