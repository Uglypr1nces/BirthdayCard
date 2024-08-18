let sender = localStorage['sender'];
let recipient = localStorage['recipient'];
let text = localStorage['text'];

document.addEventListener("DOMContentLoaded", function() {

    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");

    console.log(sender, recipient, text);
    
    if (!from.innerHTML){
        title.innerHTML = "Happy Birthday!";
        from.innerHTML = "From: " + sender;
        splitString(text, 50); 
        to.innerHTML = "To: " + recipient;
    }
    setAudio();
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

document.addEventListener('click', share);
    alert("button clicked")
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

