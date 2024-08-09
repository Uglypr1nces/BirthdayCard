import $ from 'jquery-csv.js';

  function saveEdits() {
    var sender = document.getElementById('name');
    var recipient = document.getElementById('receiver_name');
    var text = document.getElementById('text');

    var csv_data = $.csc.toobjects('birthdaycard/content/letter.csv');
  }