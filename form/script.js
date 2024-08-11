document.addEventListener('click', saveEdits);

function saveEdits() {
    var sender = document.getElementById('name').value;
    var recipient = document.getElementById('receiver_name').value;
    var text = document.getElementById('text').value;

    localStorage['sender'] = sender;
    localStorage['recipient'] = recipient;
    localStorage['text'] = text;
}