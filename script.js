let sender;
let recipient;
let text;

function saveEdits() {
  sender = document.getElementById('name');
  recipient = document.getElementById('receiver_name');
  text = document.getElementById('text');

  console.log(sender, recipient, text);
  }

export { sender, recipient, text };
