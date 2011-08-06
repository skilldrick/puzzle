$(document).ready(function () {
  var events = [
    {id: 0, start: 30, end: 150},
    {id: 1, start: 540, end: 600},
    {id: 2, start: 560, end: 620},
    {id: 3, start: 610, end: 670}
  ];

  generateFields(events);
  render(layOutDay(events));

  $('.render').click(function () {
    var events = [];
    $('#testing p').each(function () {
      var inputs = $(this).children('input');
      var start = inputs[0].value;
      var end = inputs[1].value;
      if (start === '' || end === '') {
        return;
      }
      start = +start;
      end = +end;
      if (start >=0 && start <= 720 && end >= 0 && end <= 720) {
        if (end > start) {
          events.push({start: start, end: end});
        }
        else {
          alert('End must be later than start');
        }
      }
      else {
        alert('Invalid start or end time (should be in range [0, 720])');
      }
    });

    render(layOutDay(events));
    return false;
  });
});

function generateFields(events) {
  var $testing = $('#testing');

  function addField(i) {
    var $field = $('<p>Start: <input /> End: <input /></p>');
    var inputs = $field.children('input');
    if (events[i]) {
      inputs[0].value = events[i].start;
      inputs[1].value = events[i].end;
    }

    $testing.append($field);
  }

  for (var i = 0; i < 10; i++) {
    addField(i);
  }

  $testing.append('<input class="render" type="submit" value="Render">');
}

