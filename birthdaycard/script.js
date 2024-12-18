let sender;
let recipient;
let text;
let audio_link;
let audio_chunks;
let shareableLink;

document.addEventListener("DOMContentLoaded", function () {
    try {
        const title = document.getElementById("title");
        const from = document.getElementById("from");
        const to = document.getElementById("to");
        const share_button = document.getElementById("send");
        const urlParams = new URLSearchParams(window.location.search);

        console.log("Debug: URL Params", urlParams.toString());

        if (urlParams.has('sender') && urlParams.has('recipient') && urlParams.has('text')) {
            sender = urlParams.get('sender');
            recipient = urlParams.get('recipient');
            text = urlParams.get('text');

            console.log("Debug: Retrieved from URL params", { sender, recipient, text });

            share_button.style.visibility = 'hidden';
            alert(`Happy Birthday ${recipient}!`);

            if (urlParams.has('audio_link')) {
                setAudio(urlParams.get('audio_link'), null);
            } else if (urlParams.has('audio_chunks')) {
                setAudio(null, urlParams.get('audio_chunks'));
            }
        } else if (localStorage.getItem('sender') && localStorage.getItem('recipient') && localStorage.getItem('text')) {
            sender = localStorage.getItem('sender');
            recipient = localStorage.getItem('recipient');
            text = localStorage.getItem('text');

            console.log("Debug: Retrieved from localStorage", { sender, recipient, text });

            alert("Birthday Card made!");

            if (sessionStorage.getItem('audio_link')) {
                console.log("Using audio link from sessionStorage");
                share(sessionStorage.getItem('audio_link'), null);
                setAudio(sessionStorage.getItem('audio_link'), null);
            } else if (sessionStorage.getItem('audio_chunks')) {
                console.log("Using audio chunks from sessionStorage");
                share(null, sessionStorage.getItem('audio_chunks'));
                setAudio(null, sessionStorage.getItem('audio_chunks'));            }
        } else {
            alert("How did you get here?");
            console.warn("No valid data found in URL or storage.");
        }

        if (title && from && to) {
            title.innerHTML = "Happy Birthday!";
            from.innerHTML = `From: ${sender}`;
            splitString(text, 30);
            to.innerHTML = `To: ${recipient}`;
        } else {
            console.error("Missing DOM elements for title, from, or to.");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

function splitString(stringToSplit, limit) {
    try {
        const container = document.getElementById("message");
        if (!container) throw new Error("Message container not found in DOM.");

        let message = [];
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
    } catch (error) {
        console.error("Error in splitString:", error);
    }
}

function clean() {
    try {
        localStorage.removeItem('sender');
        localStorage.removeItem('recipient');
        localStorage.removeItem('text');
        localStorage.removeItem('audio_link');
        sessionStorage.removeItem('audio_chunks');
    } catch (error) {
        console.error("Error while cleaning storage:", error);
    }
}

async function urlShortener(link) {
    try {
        const apiUrl = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`;
        console.log("Debug: Shortener API Link =", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Shortener API responded with status: ${response.status}`);
        }

        const data = await response.json();
        if (data.ok && data.result && data.result.full_short_link) {
            console.log("Shortened URL:", data.result.full_short_link);
            return data.result.full_short_link;
        } else {
            throw new Error("Invalid response structure from URL shortener API.");
        }
    } catch (error) {
        console.error("Error in URL shortener:", error);
        return null;
    }
}

function share(chunkies, linkies) {
    try {
        if (!sender || !recipient || !text) {
            throw new Error("Missing sender, recipient, or text data for sharing.");
        }

        if (linkies) {
            shareableLink = `https://uglypr1nces.github.io/BirthdayCard/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_link=${encodeURIComponent(linkies)}`;
        } else if (chunkies) {
            shareableLink = `https://uglypr1nces.github.io/BirthdayCard/birthdaycard/card.html?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}&text=${encodeURIComponent(text)}&audio_chunks=${encodeURIComponent(chunkies)}`;
        } else {
            throw new Error("No valid audio data provided for sharing.");
        }

        console.log("Debug: Shareable Link =", shareableLink);
        alert(`Share this link to ${recipient}: ${shareableLink}`);
        clean();
    } catch (error) {
        console.error("Error in share function:", error);
        alert("Something went wrong! Please try again.");
    }
}

function setAudio(audio_link, audio_chunks) {
    try {
        const audio_player = document.getElementById('audio-player');
        if (!audio_player) throw new Error("Audio player element not found in DOM.");

        if (audio_link) {
            console.log("Setting audio from link");
            audio_player.src = audio_link;
        } else if (audio_chunks) {
            console.log("Setting audio from chunks");
            const base64Chunks = JSON.parse(audio_chunks);
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
                throw new Error("Parsed audio chunks data is not a valid array.");
            }
        } else {
            console.warn("No audio data provided.");
            audio_player.src = ''; // Fallback to empty source
        }
    } catch (error) {
        console.error("Error in setAudio:", error);
        alert("Failed to process audio data.");
    }
}