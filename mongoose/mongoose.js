const express = require('express');
const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/default"

mongoose.set('useCreateIndex', true);
mongoose.connect(mongoURL, {
  dbName: 'TFBoard',
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}, (err) => {
if(err) {
    console.log('connect to mongoDB error',err);
  }
  else {
    console.log('connect mongoDB success');
  }
});

const db = mongoose.connection;
db.on('error',console.error);
db.once('open',() => {
  console.log('connect to mongoDB server');
});

module.exports = mongoose;


/*
query 연산자
operator	설명
$eq	(equals) 주어진 값과 일치하는 값
$gt	(greater than) 주어진 값보다 큰 값
$gte	(greather than or equals) 주어진 값보다 크거나 같은 값
$lt	(less than) 주어진 값보다 작은 값
$lte	(less than or equals) 주어진 값보다 작거나 같은 값
$ne	(not equal) 주어진 값과 일치하지 않는 값
$in	주어진 배열 안에 속하는 값
$nin	주어빈 배열 안에 속하지 않는 값

$or	주어진 조건중 하나라도 true 일 때 true
$and	주어진 모든 조건이 true 일 때 true
$not	주어진 조건이 false 일 때 true
$nor	주어진 모든 조건이 false 일때 true
*/
