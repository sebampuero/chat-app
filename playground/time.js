const moment = require('moment');

var date = moment();
date.add(1,'week');
console.log(date.format('MMM Do YYYY'));
