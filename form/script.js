var next_button;

document.addEventListener('DOMContentLoaded', function() {
    var next_button = document.getElementById('next-button');
    next_button.style.display = 'none';
});


document.getElementById('next-button').onclick = function() {
    var sender = document.getElementById('name').value;
    var recipient = document.getElementById('receiver_name').value;
    var text = document.getElementById('text').value;

    localStorage['sender'] = sender;
    localStorage['recipient'] = recipient;
    localStorage['text'] = text;
}

document.getElementById('check-button').onclick = function() {
    var audio_link = document.getElementById('audio-link').value;
    var audio_player = document.getElementById('audio-player');

    if (audio_link !== '' && audio_player.src) {
        alert('You cant add a link and an audio');
    }
    else if (audio_link == '' && !audio_player.src) {
        alert('Add an audio or record your own');
    }
    else if (audio_link !== '' && !audio_player.src) {
        try {
            audio_player.src = audio_link;
            var check_button = document.getElementById('check-button');
            var next_button = document.getElementById('next-button');
            check_button.style.display = 'none';
            next_button.style.display = 'block';
        }
        catch (error) {
            alert('Cant use url as audio source');
    }}
    else {
        var check_button = document.getElementById('check-button');
        var next_button = document.getElementById('next-button');
        check_button.style.display = 'none';
        next_button.style.display = 'block';
    }
}