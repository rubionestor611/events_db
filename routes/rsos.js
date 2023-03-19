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

//returns all rsos the user is in
router.get('/:user_id/in', (req,res)=>{
  const user_id = req.params.user_id;

  let sql = 'SELECT * FROM rsos WHERE id = (SELECT rso_id FROM rso_members WHERE user_id = ?) AND approved = 1'
  db.query(sql,user_id, (err,result)=>{
    if(err){
      return res.status(400).json(err);
    }
    const rsos = [];
    for(let i = 0; i < Object.keys(result).length; i++){
      rsos.push(({
        "id": result[i].id,
        "name": result[i].name,
        "admin_id": result[i].admin_id,
        "uni_id": result[i].uni_id
      }));
    }
    
    return res.json({rsos,success:true});
  });
})

//provide uni_id in body
router.get('/:uni_id/', (req,res) =>{
  const uni_id= req.params.uni_id;
  const sql = "SELECT * FROM rsos WHERE uni_id = ? AND approved = 1";
  db.query(sql,uni_id,(err,result)=>{
    const rsos = [];
    for(let i = 0; i < Object.keys(result).length; i++){
      rsos.push(({
        "id": result[i].id,
        "name": result[i].name,
        "admin_id": result[i].admin_id,
        "uni_id": result[i].uni_id
      }));
    }

    res.json({rsos, success:true});
  })
});

// let user w/ id leave rso
router.post('/leave', (req,res) => {
  const {user_id, rso_id} = req.body;
  let sql = 'DELETE FROM rso_members WHERE user_id = ? AND rso_id = ?';
  db.query(sql, [user_id, rso_id], (err, result) => {
      if (err) {
          return res.status(400).send(err);
      }

      let sql = 'SELECT * FROM rsos WHERE id = (SELECT rso_id FROM rso_members WHERE user_id = ?) AND approved = 1'
      db.query(sql,user_id, (err,result)=>{
        if(err){
          return res.status(400).json(err);
        }
        const rsos = [];
        for(let i = 0; i < Object.keys(result).length; i++){
          rsos.push(({
            "id": result[i].id,
            "name": result[i].name,
            "admin_id": result[i].admin_id,
            "uni_id": result[i].uni_id
          }));
        }
        return res.json({rsos,success:true});
      });
    
  });
});

// create an rso
router.post('/create', (req,res) => {
  
    const {name, approved, uni_id, user_id} = req.body;

    // get info about the RSO we want to make
    let sql = "SELECT * FROM rsos WHERE name = ? AND uni_id = ?";
    db.query(sql, [name,uni_id], (err,result)=>{
      if (err) {   
        return res.status(400).send(err);
      }
      let numResults = Object.keys(result).length;

      // if length of result is 0, we create it
      if(numResults == 0){
        //create the rso for the uni
        sql = 'INSERT INTO rsos (name, approved, admin_id, uni_id) VALUES ( ?, ?, ?, ?)';
        db.query(sql, [name, approved, user_id, uni_id], (err, result) => {
            if (err) {   
                return res.status(400).send(err);
            }
            sql = 'SELECT id FROM rsos WHERE name = ?';
            db.query(sql,name,(err,result)=>{
              if (err) {   
                return res.status(400).send(err);
              }
              const new_rso_id = result[0].id;
              // have this user join the RSO
              sql = 'INSERT INTO rso_members (user_id, rso_id) VALUES (? , ?)'
              db.query(sql, [user_id, new_rso_id], (err,result)=>{
                if (err) {   
                  return res.status(400).send(err);
                }
                return res.status(200).json({success:true});
              })
            })
        });
        return;
      }else{
        // RSO exists
        // have this user join the RSO
        const rsoID =  result[0].id

        // if user in it just return
        sql = 'SELECT * FROM rso_members WHERE user_id = ? AND rso_id = ?';
        db.query(sql, [user_id, rsoID], (err,result)=>{
          if (err) {   
            return res.status(400).send(err);
          }
          if (Object.keys(result).length > 0){
            return res.status(401).json({msg: `Already a member of ${name}`})
          }

          // if user not in, just add them
          sql = 'INSERT INTO rso_members (user_id, rso_id) VALUES (? , ?)'
          db.query(sql, [user_id, rsoID], (err,result)=>{
            if (err) {   
              return res.status(400).send(err);
            }

            // get how many members this RSO has
            sql = 'SELECT * FROM rso_members WHERE rso_id = ?'
            db.query(sql, rsoID, (err,result)=>{
              if(err) {
                return res.status(400).send(err);
              }

              const numMembers = Object.keys(result).length;
              if(numMembers >= 4){
                sql = 'UPDATE rsos SET approved = 1 WHERE id = ?'
                db.query(sql, result[0].rso_id, (err, result)=>{
                  if(err){
                    return res.status(400).send(err);
                  }
                });

                sql = 'UPDATE users SET auth_level = 2 WHERE id = (SELECT admin_id FROM rsos WHERE id = ?)'
                
                db.query(sql, result[0].rso_id);
              }
            });

          });
        })
      }
    });
});

// to join means it's already approved
// let user w/ id join rso
router.post('/join', (req,res) => {
  const {user_id, rso_id} = req.body;

  // if user in it just return
  let sql = 'SELECT * FROM rso_members WHERE user_id = ? AND rso_id = ?';
  db.query(sql, [user_id, rso_id], (err,result)=>{
    if (err) {   
      return res.status(400).send(err);
    }
    if (Object.keys(result).length > 0){
      console.log(result)
      return res.status(401).json({msg: `Already a member of this RSO`})
    }

    sql = 'INSERT INTO rso_members (user_id, rso_id) VALUES ( ? , ?)';
    db.query(sql, [user_id, rso_id], (err, result) => {
        if (err)
        {
            return res.status(400).send(err);
        }

        // get how many members this RSO has
            sql = 'SELECT * FROM rso_members WHERE rso_id = ?'
            db.query(sql, rso_id, (err,result)=>{
              if(err) {
                return res.status(400).send(err);
              }

              const numMembers = Object.keys(result).length;
              if(numMembers >= 4){
                sql = 'UPDATE rsos SET approved = 1 WHERE id = ?'
                db.query(sql, result[0].rso_id, (err, result)=>{
                  if(err){
                    return res.status(400).send(err);
                  }
                });

                sql = 'UPDATE users SET auth_level = 2 WHERE id = (SELECT admin_id FROM rsos WHERE id = ?)'
                db.query(sql, result[0].rso_id, (err, result)=>{
                  if(err){
                    return res.status(400).send(err);
                  }
                  return res.status(200).json({success:true})
                });
              }
            });

    });
  });

  
});
module.exports = router;