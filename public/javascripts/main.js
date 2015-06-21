var clientId = $('#clientID').val();
var meet = $('#meet').val();
var meeting = JSON.parse(meet);
var counter = new Meetoring.Counter('#meetingTotalValue', 200, meeting);

function sync(newMeeting) {
  counter.sync(meeting = newMeeting)
  var attendees = meeting.attendees.length;

  var msg = attendees == 0 ? '' : 
      attendees == 1 ? '1 attendee' : 
      attendees + ' attendees';
  $('.attendeesCount').text(msg);
  
  if (_.include(meeting.attendees, clientId)) {
    $("#form-join").hide();
    $("#form-leave").fadeIn();
  }
  else {
    $("#form-join").fadeIn();
    $("#form-leave").hide();
  }
}

$(function() {
  console.log(meeting.name);
  $('#form-share').hide().removeClass('hidden').fadeIn().find('input').val(document.location);

  $("#rate").keyup(function(event){
    
    var value = $("#rate").val();
    var floatRegex = /^([0-9]*[\.,][0-9]+|[0-9]+)$/;
    
    if (!floatRegex.test(value)) {
      $('#join').attr('disabled', 'disabled');
      return;
    }
  
    $('#join').removeAttr('disabled');

    if(event.keyCode == 13){
        $("#join").click();
    }
  }).keypress(function(event) {
    var key = event.charCode;
    return (key == 8
      || key == 44
      || key == 46
      || (key >= 48 && key <= 57));
  });

  $('#rate').tooltip();

  var socket = io.connect('http://'+'localhost:3000'+'/'+meeting.id);
  socket.on('update', sync);
  socket.on('connect', function(){
    socket.emit('identify', clientId, function(meeting) {
      
      $("#form-join").hide().removeClass('hidden');
      $("#form-leave").hide().removeClass('hidden');
      
      sync(meeting);
      
      $('#join').click(function(){
        var rate =  $("#rate").val();
        $("#form-join").fadeOut();

        socket.emit('join', rate, function(meeting) {
          sync(meeting);
          $("#form-leave").fadeIn();
        });
      });

      $('#leave').click(function(){
        $("#form-leave").fadeOut();
      
        socket.emit('leave', function(meeting) {
          sync(meeting);
          $("#form-join").fadeIn();
        });
      });
    
      setInterval(function(){ socket.emit('sync', sync)}, 1000 * 10);
    });
  });
});