var express = require('express');
var router = express.Router();
var app = require('../app');

var Meeting = require('../meeting');
var setupRealtime = require('../realtime');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:meetingId' , function(req, res, next) {
    var id = req.params.meetingId;
    Meeting.read(id, function(err, meeting) {
        if(err) throw err;
        if (!meeting) { 
            next();
            return;
        }
        console.log(meeting);
        res.render('meeting', { meet: meeting.clientModel(), clientID: req.cookies.id });
    });
});

router.post('/', function(req, res, next){

    var meeting = new Meeting(req.body.meetingName);
    meeting.save(function(err) {
        if(err) throw err;
        console.log(2,'pass');
        setupRealtime(app, meeting);
        res.redirect('/'+meeting.id);
    });
});

module.exports = router;
