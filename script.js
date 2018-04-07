import io from 'socket.io-client';
import $ from 'jquery';

var socket = io();

$('#nickForm').submit(function(e) {
	e.preventDefault();
	if ($('#nick').val().length <= 15) {
		socket.emit('set nickname', $('#nick').val());
		socket.emit('update namelist');
		document.getElementById("enter").innerHTML = "";
		$('#enter').hide();
	}
});

$('#chatForm').submit(function(e) {
	e.preventDefault();
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
});

///////////////

socket.on('user disconnected', function(nickname) {
	$('#messages').append($('<span class="disUserMsg">').text(nickname + " has disconnected"));
	socket.emit('update namelist');
});

socket.on('chat message', function(nickname, msg) {
	$('#messages').append($('<span>').text("<" + nickname + ">: " + msg));
});

socket.on('set nickname', function(nickname) {
	$('#messages').append($('<span class="newUserMsg">').text(nickname + " has joined"));
});

socket.on('setnick message', function() {
	$('#messages').append($('<span>').text("Please choose a nickname first."));
});

socket.on('update namelist', function(nicknamesValue) {
	$('#nicknames').empty();
	nicknamesValue.forEach(function(name) {
		$('#nicknames').append($('<span>').text(name));
	});
});

//////////////

$('#m').keyup(function() {
	if ($(this).val().length > 300) {
		$(this).css('background-color', '#ff5050');
	}
	else {
		$(this).css('background-color', '#ffff66');
	}
});

$('#nick').keyup(function() {
	if ($(this).val().length > 15) {
		$(this).css('background-color', '#ff5050');
	}
	else {
		$(this).css('background-color', '#ffff66');
	}
});