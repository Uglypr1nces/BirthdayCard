const record_btn = document.getElementById('record-button');
const audio_player = document.getElementById('audio-player');
const next_btn = document.getElementById('next-button'); 

next_btn.addEventListener('click', StoreAudio);
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
        console.log("blob: " + blob);
        console.log("chunks" + chunks);
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio_player.src = audioURL;
    };  
}

function ToggleMic(){
    if(can_record){
        if(is_recording){
            recorder.stop();
            record_btn.innerText = 'Record';
            is_recording = false;
            
        }else{
            recorder.start();
            record_btn.innerText = 'Stop';
            is_recording = true;
        }
    }else{
        alert('Please allow microphone access');
    }
}

function StoreAudio() {
    if (audio_player.src) {
        // Convert each Blob chunk to a Base64 string and store them in an array
        const base64Chunks = [];
        chunks.forEach(chunk => {
            const reader = new FileReader();
            reader.onloadend = function() {
                base64Chunks.push(reader.result.split(',')[1]); // Store the base64 part
                if (base64Chunks.length === chunks.length) {
                    sessionStorage.setItem('audio_chunks', JSON.stringify(base64Chunks));
                }
            };
            reader.readAsDataURL(chunk);
        });
    } else {
        alert('Please record audio first');
    }
}


SetupAudio();