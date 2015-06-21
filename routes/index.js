var express = require('express');
var router = express.Router();
var app = require('../app');

var Meeting = require('../meeting');
var setupRealtime = require('../realtime');

var meetings = {}; // replace with mongo db

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:meetingId' , function(req, res, next) {
    var id = req.params.meetingId;
    if (!meetings.hasOwnProperty(id)) { // check db for matches
      next();
      return;
    }
    res.render('meeting', { meet: meetings[id].clientModel(), clientID: req.cookies.id });
});

router.post('/', function(req, res, next){

    var meeting = new Meeting(req.body.meetingName);
    meetings[meeting.id] = meeting;

    setupRealtime(app, meeting);

    res.redirect('/'+meeting.id);
});

module.exports = router;
