document.addEventListener("DOMContentLoaded", function() {
    // Retrieve values from localStorage
    let sender = localStorage.getItem('sender');
    let recipient = localStorage.getItem('recipient');
    let text = localStorage.getItem('text');

    // Update the DOM elements with the retrieved values
    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");
    
    title.innerHTML = "Happy Birthday!";
    from.innerHTML = "From: " + sender;
    splitString(text, 50); 
    to.innerHTML = "To: " + recipient;

    // Initialize audio if available
    setAudio();
    
    // Create and copy shareable link to clipboard
    share();
});

function splitString(stringToSplit, limit) {
    let message = [];
    let container = document.getElementById("message"); // Ensure this ID is correct

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
    // Retrieve values from localStorage
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
