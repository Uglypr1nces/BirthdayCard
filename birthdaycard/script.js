let sender;
let recipient;
let text;
let audio_link;

document.addEventListener("DOMContentLoaded", function() {
    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");

    var share_button = document.getElementById("send")

    const urlParams = new URLSearchParams(window.location.search);

    // Explicitly check if all required localStorage items are present
    if (localStorage.getItem('sender') && localStorage.getItem('recipient') && localStorage.getItem('text') && localStorage.getItem('audio_link')) {
        sender = localStorage.getItem('sender');
        recipient = localStorage.getItem('recipient');
        text = localStorage.getItem('text');
        audio_link = localStorage.getItem('audio_link');
    } else {
        sender = urlParams.get('sender');
        recipient = urlParams.get('recipient');
        text = urlParams.get('text');
        audio_link = urlParams.get('audio_link');
        share_button.style.visibility = 'none'
    }

    title.innerHTML = "Happy Birthday!";
    from.innerHTML = "From: " + sender;
    splitString(text, 30);
    to.innerHTML = "To: " + recipient;

    setAudio();
    share();
});

function splitString(stringToSplit, limit) {
    let message = [];
    let container = document.getElementById("message");

    for (var i = 0; i < stringToSplit.length; i += 1) {
        if (i % limit === 0 && i !== 0) {
            var newLine = document.createElement("p");
            newLine.innerHTML = message.join('');
            container.appendChild(newLine);
            message = [];
        }
        message.push(stringToSplit[i]);
    }

    if (message.length > 0) {
        var newLine = document.createElement("p");
        newLine.innerHTML = message.join('');
        container.appendChild(newLine);
    }
}

function share() {
    const shareableLink = `https://uglypr1nces.github.io/birthday/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_link=${encodeURIComponent(audio_link)}`;
    
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}

function setAudio() {
    let audio_player = document.getElementById('audio-player');
    let audioChunks = sessionStorage.getItem('audio_chunks');

    if (audio_link) {
        audio_player.src = audio_link;
    } else if (audioChunks) {
        try {
            let base64Chunks = JSON.parse(audioChunks);
            if (base64Chunks && Array.isArray(base64Chunks)) {
                const blobParts = base64Chunks.map(base64 => {
                    const binaryString = atob(base64);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    return new Blob([bytes], { type: 'audio/wav' });
                });

                const finalBlob = new Blob(blobParts, { type: 'audio/wav' });
                audio_player.src = window.URL.createObjectURL(finalBlob);
            } else {
                console.error("Parsed data is not a valid array");
            }
        } catch (error) {
            console.error("Error parsing JSON: ", error);
        }
    } else {
        alert("No Audio available");
    }
}
