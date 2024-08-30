let sender;
let recipient;
let text;
let audio_link = null;
let audio_chunks = null;

document.addEventListener("DOMContentLoaded", function() {
    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");

    var share_button = document.getElementById("send");

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('sender') && urlParams.has('recipient') && urlParams.has('text')) {
        sender = urlParams.get('sender');
        recipient = urlParams.get('recipient');
        text = urlParams.get('text');

        share_button.style.visibility = 'hidden';
        alert("Happy Birthday " + recipient);

        if (urlParams.has('audio_link')) {
            setAudio(urlParams.get('audio_link'), null); 
        } else if (urlParams.has('audio_chunks')) {
            setAudio(null, urlParams.get('audio_chunks')); 
        }
    } 

    else if (localStorage.getItem('sender') && localStorage.getItem('recipient') && localStorage.getItem('text')) {
        sender = localStorage.getItem('sender');
        recipient = localStorage.getItem('recipient');
        text = localStorage.getItem('text');
        alert("Birthday Card made!");
        share();

        if (sessionStorage.getItem('audio_link')) {
            setAudio(sessionStorage.getItem('audio_link'), null); 
        } else if (sessionStorage.getItem('audio_chunks')) {
            setAudio(null, sessionStorage.getItem('audio_chunks')); 
        }
    }
    
    else {
        alert("how did you get here?");
    }

    if (urlParams.has('audio_link')) {
        setAudio(urlParams.get('audio_link'), null); 
    } else if (urlParams.has('audio_chunks')) {
        setAudio(null, urlParams.get('audio_chunks')); 
    }

    console.log(sender, recipient, text);

    title.innerHTML = "Happy Birthday!";
    from.innerHTML = "From: " + sender;
    splitString(text, 30);
    to.innerHTML = "To: " + recipient;
});

function splitString(stringToSplit, limit) {
    let message = [];
    let container = document.getElementById("message");

    for (let i = 0; i < stringToSplit.length; i++) {
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

function share() {
    let shareableLink;
    if (audio_chunks) {
        shareableLink = `https://uglypr1nces.github.io/BirthdayCard/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_chunks=${encodeURIComponent(audio_chunks)}`;
    } else if (audio_link) {
        shareableLink = `https://uglypr1nces.github.io/BirthdayCard/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_link=${encodeURIComponent(audio_link)}`;
    } else {
        alert("No link or recording to pass...");
        return; 
    }

    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
        localStorage.removeItem('sender');
        localStorage.removeItem('recipient');
        localStorage.removeItem('text');
        localStorage.removeItem('audio_link');
        sessionStorage.removeItem('audio_chunks');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}

function setAudio(audio_link, audio_chunks) {
    let audio_player = document.getElementById('audio-player');

    if (audio_link) {
        audio_player.src = audio_link;
    } else if (audio_chunks) {
        try {
            let base64Chunks = JSON.parse(audio_chunks);
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
