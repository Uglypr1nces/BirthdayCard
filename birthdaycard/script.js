let sender, recipient, text, shareableLink;

document.addEventListener("DOMContentLoaded", function () {
    try {
        initializeData();
        updateUI();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

/**
 * Initializes data from URL parameters or localStorage.
 */
function initializeData() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("sender") && urlParams.has("recipient") && urlParams.has("text")) {
        // Retrieve data from URL parameters
        sender = urlParams.get("sender");
        recipient = urlParams.get("recipient");
        text = urlParams.get("text");

        console.log("Debug: Data retrieved from URL params:", { sender, recipient, text });

        // Handle audio setup
        const audioLink = urlParams.get("audio_link");
        const audioChunks = urlParams.get("audio_chunks");
        if (audioLink) {
            setAudio(audioLink, null);
        } else if (audioChunks) {
            setAudio(null, audioChunks);
        }

        // Hide the share button (specific to this case)
        document.getElementById("send").style.visibility = "hidden";
        alert(`Happy Birthday ${recipient}!`);
    } else if (localStorage.getItem("sender") && localStorage.getItem("recipient") && localStorage.getItem("text")) {
        // Retrieve data from localStorage
        sender = localStorage.getItem("sender");
        recipient = localStorage.getItem("recipient");
        text = localStorage.getItem("text");

        console.log("Debug: Data retrieved from localStorage:", { sender, recipient, text });

        // Handle audio setup
        const audioLink = localStorage.getItem("audio_link");
        const audioChunks = localStorage.getItem("audio_chunks");
        if (audioLink) {
            setAudio(audioLink, null);
        } else if (audioChunks) {
            setAudio(null, audioChunks);
        }

        alert("Birthday card created!");
    } else {
        alert("No data found! Please check the URL or localStorage.");
        console.warn("Debug: Missing data in URL parameters or localStorage.");
    }
}

/**
 * Updates the UI with the retrieved data.
 */
function updateUI() {
    const title = document.getElementById("title");
    const from = document.getElementById("from");
    const to = document.getElementById("to");

    if (title && from && to) {
        title.innerHTML = "Happy Birthday!";
        from.innerHTML = `From: ${sender}`;
        to.innerHTML = `To: ${recipient}`;
        displayMessageWithLineBreaks(text, 30);
    } else {
        console.error("Missing DOM elements for title, from, or to.");
    }
}

/**
 * Splits a string into lines of a specific length and updates the UI.
 */
function displayMessageWithLineBreaks(stringToSplit, limit) {
    try {
        const container = document.getElementById("message");
        if (!container) throw new Error("Message container not found in DOM.");

        container.innerHTML = ""; // Clear any existing content
        let message = [];

        for (let i = 0; i < stringToSplit.length; i++) {
            if (i % limit === 0 && i !== 0) {
                appendMessageLine(container, message);
                message = [];
            }
            message.push(stringToSplit[i]);
        }

        // Append the last line
        if (message.length > 0) appendMessageLine(container, message);
    } catch (error) {
        console.error("Error in displayMessageWithLineBreaks:", error);
    }
}

/**
 * Appends a message line to the container.
 */
function appendMessageLine(container, message) {
    const newLine = document.createElement("p");
    newLine.textContent = message.join("");
    container.appendChild(newLine);
}

/**
 * Cleans up all stored data.
 */
function clean() {
    try {
        localStorage.clear();
        console.log("LocalStorage cleared.");
    } catch (error) {
        console.error("Error while cleaning storage:", error);
    }
}

/**
 * Shortens a given URL using the shrtco.de API.
 */
async function urlShortener(link) {
    try {
        const apiUrl = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`;
        console.log("Debug: Shortener API Link =", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Shortener API responded with status: ${response.status}`);

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

/**
 * Creates and displays a shareable link.
 */
function share(audioChunks, audioLink) {
    try {
        if (!sender || !recipient || !text) {
            throw new Error("Missing sender, recipient, or text data for sharing.");
        }

        if (audioLink) {
            shareableLink = createShareableLink(audioLink, null);
        } else if (audioChunks) {
            shareableLink = createShareableLink(null, audioChunks);
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

/**
 * Generates a shareable link.
 */
function createShareableLink(audioLink, audioChunks) {
    const baseURL = "https://uglypr1nces.github.io/BirthdayCard/birthdaycard/card.html";
    const params = new URLSearchParams({
        sender: encodeURIComponent(sender),
        recipient: encodeURIComponent(recipient),
        text: encodeURIComponent(text),
    });

    if (audioLink) params.set("audio_link", encodeURIComponent(audioLink));
    if (audioChunks) params.set("audio_chunks", encodeURIComponent(audioChunks));

    return `${baseURL}?${params.toString()}`;
}

/**
 * Sets the audio source for the player.
 */
function setAudio(link, chunks) {
    try {
        const audioPlayer = document.getElementById("audio-player");
        if (!audioPlayer) throw new Error("Audio player element not found in DOM.");

        if (link) {
            console.log("Setting audio from link:", link);
            audioPlayer.src = link;
        } else if (chunks) {
            console.log("Setting audio from chunks.");
            const blob = createBlobFromChunks(chunks);
            audioPlayer.src = window.URL.createObjectURL(blob);
        } else {
            console.warn("No audio data provided.");
            audioPlayer.src = ""; // Fallback to empty source
        }
    } catch (error) {
        console.error("Error in setAudio:", error);
        alert("Failed to process audio data.");
    }
}

/**
 * Converts audio chunks (base64) to a Blob.
 */
function createBlobFromChunks(chunks) {
    const base64Chunks = JSON.parse(chunks);
    const blobParts = base64Chunks.map(base64 => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: "audio/wav" });
    });

    return new Blob(blobParts, { type: "audio/wav" });
}
