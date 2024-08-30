const record_btn = document.getElementById('record-button');
const audio_player = document.getElementById('audio-player');
const next_btn = document.getElementById('next-button'); 

record_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;
let recorder = null;

let chunks = [];

function SetupAudio(){
    console.log('Setting up audio');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(SetupStream,
            can_record = true
        )
        .catch(function(err) {
            console.log(err);
        });
    }
}

function SetupStream(stream){
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
    };
    recorder.onstop = e => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        console.log("blob: ", blob);
        console.log("chunks: ", chunks);
        const audioURL = window.URL.createObjectURL(blob);
        audio_player.src = audioURL;

        // Call StoreAudio only after the chunks have been processed
        StoreAudio();

        // Clear chunks after storing
        chunks = [];
    };  
}

function ToggleMic(){
    if(can_record){
        if(is_recording){
            recorder.stop();
            record_btn.innerText = 'Record';
            is_recording = false;
        } else {
            recorder.start();
            record_btn.innerText = 'Stop';
            is_recording = true;
        }
    } else {
        alert('Please allow microphone access');
    }
}

function StoreAudio() {
    if (chunks.length > 0) {
        const base64ChunksPromises = chunks.map(chunk => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const base64 = reader.result.split(',')[1]; // Base64 part
                    resolve(base64);
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(chunk);
            });
        });

        Promise.all(base64ChunksPromises)
            .then(base64Chunks => {
                sessionStorage.setItem('audio_chunks', JSON.stringify(base64Chunks));
                console.log(sessionStorage.getItem('audio_chunks'));
            })
            .catch(error => {
                console.error('Error encoding audio chunks: ', error);
            });
    } else {
        alert('Please record audio first');
    }
}

SetupAudio();
