let sender = localStorage['sender'];
let recipient = localStorage['recipient'];
let text = localStorage['text'];

document.addEventListener("DOMContentLoaded", function() {
    var title = document.getElementById("title");
    var from = document.getElementById("from");
    var to = document.getElementById("to");

    console.log(sender, recipient, text);
    
    title.innerHTML = "Happy Birthday!";
    from.innerHTML = "From: " + sender;
    splitString(text, 50); 
    to.innerHTML = "To: " + recipient;
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