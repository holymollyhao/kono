const express = require('express');
const db = require("../../../db");

exports.rooms = (req, res) => {
  const queryString = `SELECT * FROM room t1 WHERE t1.timestamp =
(SELECT MAX(t2.timestamp) FROM room t2
 WHERE t2.room_number = t1.room_number) ORDER BY room_number;`
  db.query(queryString, (err, rows, fields) => {
    if(!err){
      res.status(200);
      const retRow = rows.map(u => ({room_number: u.room_number, status: u.status,
      timestamp: u.timestamp, duration: u.duration}))
      res.send(retRow);
    }else{
      res.status(500);
      console.log("Error while performing Query string");
    }
  });
}
