var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/meetoring');
var meets = db.get("meetings");

function addMeeting(meeting, callback) {
    meets.insert(meeting, function (err, doc) {
        if (err) {
            return callback(err);
        }
        else {
            console.log('new meeting added');
            callback();
        }
    });
}

function getMeeting(id, callback) {
    meets.find({"id": id}, function(e,docs){
        if (e) return callback(e);
        if (!docs) {
            return callback(null, {});
        }
        else {
            callback(null, docs[0]);
        }
    });
}

module.exports.addMeeting = addMeeting;
module.exports.getMeeting = getMeeting;