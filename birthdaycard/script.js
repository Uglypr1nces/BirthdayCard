let sender = localStorage.getItem('sender');
let recipient = localStorage.getItem('recipient');
let text = localStorage.getItem('text');

document.addEventListener("DOMContentLoaded", function() {
    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");
    
    title.innerHTML = "Happy Birthday!";
    from.innerHTML = "From: " + sender;
    splitString(text, 30); 
    to.innerHTML = "To: " + recipient;

    try {
        setAudio();
        
    }
    catch (error) {
        console.error('Error retrieving audio chunks:', error);
    }
    share();
});

function splitString(stringToSplit, limit) {
    let message = [];
    let container = document.getElementById("message"); // Corrected ID

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
    const shareableLink = `https://uglypr1nces.github.io/birthday/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}`;
    
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}

function setAudio() {
    let audio_player = document.getElementById('audio-player');
    let audioChunks = sessionStorage.getItem('audio_chunks');

    if (audioChunks) {
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
        console.error('No audio found. Please record first.');
    }
}
