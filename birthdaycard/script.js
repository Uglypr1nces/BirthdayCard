let sender = localStorage['sender'];
let recipient = localStorage['recipient'];
let text = localStorage['text'];

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sender = urlParams.get('sender');
    const recipient = urlParams.get('recipient');
    const text = urlParams.get('text');

    if (sender) {
        document.getElementById('from').textContent = `From: ${decodeURIComponent(sender)}`;
    }
    
    if (recipient) {
        document.getElementById('to').textContent = `To: ${decodeURIComponent(recipient)}`;
    }

    if (text) {
        splitString(decodeURIComponent(text), 50);
    }

    setAudio();
});

function share() {
    const sender = localStorage.getItem('sender');
    const recipient = localStorage.getItem('recipient');
    const text = localStorage.getItem('text');
    
    // Encode the parameters for the URL
    const shareableLink = `https://uglypr1nces.github.io/birthday/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}`;
    
    // Copy the shareable link to the clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}


function share() {
    // Combine the content of the card into one string
    let cardContent = `
        Happy Birthday!\n
        \nTo: ${localStorage.getItem('recipient')}\n
        From: ${localStorage.getItem('sender')}\n
        Message: ${localStorage.getItem('text')}\n
    `;
    
    // Encode the card content for the URL
    const shareableLink = `https://uglypr1nces.github.io/birthday/birthdaycard/card.html?content=${encodeURIComponent(cardContent)}`;
    
    // Copy the shareable link to the clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy the link:', err);
    });
}



function setAudio() {
    let audio_player = document.getElementById('audio-player');
    let audioChunks = sessionStorage.getItem('audio_chunks');
    
    // Check if audioChunks exists and is not null or undefined
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
        alert('No audio found. Please record first.');
    }
}

