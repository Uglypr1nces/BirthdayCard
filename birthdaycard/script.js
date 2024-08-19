document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get data from URL parameters
    let sender = urlParams.get('sender');
    let recipient = urlParams.get('recipient');
    let text = urlParams.get('text');
    let audio_link = urlParams.get('audio_link');

    // If URL parameters are missing, set default values or handle accordingly
    sender = sender ? decodeURIComponent(sender) : 'Anonymous';
    recipient = recipient ? decodeURIComponent(recipient) : 'Recipient';
    text = text ? decodeURIComponent(text) : 'Best wishes!';
    audio_link = audio_link ? decodeURIComponent(audio_link) : null;

    // Update the card content
    document.getElementById("title").innerHTML = "Happy Birthday!";
    document.getElementById("from").innerHTML = "From: " + sender;
    splitString(text, 30);
    document.getElementById("to").innerHTML = "To: " + recipient;

    // Set audio
    setAudio(audio_link);
});

function splitString(stringToSplit, limit) {
    let message = [];
    let container = document.getElementById("message");

    for (let i = 0; i < stringToSplit.length; i += 1) {
        if (i % limit === 0 && i !== 0) {
            let newLine = document.createElement("p");
            newLine.innerHTML = message.join('');
            container.appendChild(newLine);
            message = []; 
        }
        message.push(stringToSplit[i]);
    }

    if (message.length > 0) {
        let newLine = document.createElement("p");
        newLine.innerHTML = message.join('');
        container.appendChild(newLine);
    }
}

function setAudio(audio_link) {
    let audio_player = document.getElementById('audio-player');

    if (audio_link) {
        audio_player.src = audio_link;
    } else { 
        alert("No audio link provided.");
    }
}

function share() {
    // Fetch data from inputs or existing values
    const sender = document.getElementById('name').value || 'Anonymous';
    const recipient = document.getElementById('receiver_name').value || 'Recipient';
    const text = document.getElementById('text').value || 'Best wishes!';
    const audio_link = document.getElementById('audio-link').value;

    // Encode and create shareable link
    const shareableLink = `https://uglypr1nces.github.io/birthday/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_link=${encodeURIComponent(audio_link)}`;
    
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}
