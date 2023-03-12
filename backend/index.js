import express from 'express';
import mysql from 'mysql';

const app = express();

const db = mysql.createConnection({
  root: "localhost",
  user:"root",
  password:"",
  database:"events"
});

app.get("/users", async (req,res)=>{
  const query = "SELECT * FROM users";
  db.query(query, (err,data)=>{
    if (err) return res.json(err);
    return res.json(data);
  })
});

app.listen(8800, ()=>{
  console.log('Listening on port 8800...');
});