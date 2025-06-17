let audio_link;
let audio_chunks;

document.addEventListener('DOMContentLoaded', function() {
    var next_button = document.getElementById('next-button');
    next_button.style.display = 'none';
});


document.getElementById('next-button').onclick = function() {
    var sender = document.getElementById('name').value;
    var recipient = document.getElementById('receiver_name').value;
    var text = document.getElementById('text').value;
    audio_link = document.getElementById('audio-link').value;

    console.log('sender:', sender);
    console.log('recipient:', recipient);
    console.log('text:', text);
    console.log('audio_link:', audio_link);
    console.log('audio_chunks:', audio_chunks);

    localStorage['sender'] = sender;
    localStorage['recipient'] = recipient;
    localStorage['text'] = text;
    localStorage['audio_link'] = audio_link;
    localStorage['audio_chunks'] = audio_chunks;

}
document.getElementById('check-button').onclick = function(event) {
    event.preventDefault(); // Prevent form submission

    audio_link = document.getElementById('audio-link').value;
    audio_chunks = document.getElementById('audio-player');

    if (audio_link !== '' && audio_chunks.src) {
        alert('You cant add a link and an audio');
    }
    else if (audio_link === '' && audio_chunks.src === '') {
        alert('Add an audio or record your own');
    }    
    else if (audio_link !== '' && !audio_chunks.src) {
        try {
            document.getElementById('audio-player').src = audio_link;
            var check_button = document.getElementById('check-button');
            var next_button = document.getElementById('next-button');
            check_button.style.display = 'none';
            next_button.style.display = 'block';
        }
        catch (error) {
            alert('Cant use url as audio source');
            audio_player.src = '';
        }
    }
    else {
        var check_button = document.getElementById('check-button');
        var next_button = document.getElementById('next-button');
        check_button.style.display = 'none';
        next_button.style.display = 'block';
    }
};