/**
Lays out events for a single  day
 
@param array  events  
An array of event objects. Each event object consists of a start time,
end time (measured in minutes) from 9am, as well as a unique id. The
start and end time of each event will be [0, 720]. The start time will
be less than the end time.  The array is not sorted.
 
@return array
An array of event objects that has the width, the left and top positions
set, In addition to start time, end time, and id. 
 
**/

function layOutDay(rawEvents) {
  if (!_.isArray(rawEvents)) {
    throw new TypeError('Events must be an array');
  }
  rawEvents = sortByStartAndEnd(rawEvents);

  // create event objects
  var events = _.map(rawEvents, function (event) {
    return EventMaker(event);
  });

  //Tell each event which earlier events it collides with
  _.each(events, function (event, idx) {
    var prevEvents = _.first(events, idx); //first n events

    _.each(prevEvents, function (prevEvent) {
      if (timeCollision(prevEvent, event)) {
        event.collidesWith.push(prevEvent);
      }
    });
  });

  _.each(events, function (event, idx) {
    if (idx === 0) {
      return;
    }
  });


  console.log(events);

  //
  //xxx
  //xxx xxx
  //xxx xxx xxx
  //        xxx xxx <- This can go under the first element
  //            xxx
  //
  //xxx
  //xxx xxx
  //xxx xxx xxx
  //xxx     xxx 
  //xxx         
  //
}

function render(events) {
  $calendar = $('#calendar');
  $ev1 = $('<div class="event" />');
  $ev1.css('height', 100);
  $ev2 = $('<div class="event" />');
  $ev2.css('height', 75);
  $calendar.append($ev1);
  $calendar.append($ev2);
}

/**
Helper functions
**/

function timeCollision(event1, event2) {
  if (!isEvent(event1) || !isEvent(event2)) {
    throw new TypeError('Both arguments must be events');
  }

  return event1.end > event2.start && event1.start < event2.end
}

function spaceCollision(event1, event2) {
  if (!timeCollision(event1, event2)) {
    return false;
  }

  return event1.right() > event2.left() && event1.left() < event2.right();
}

function isEvent(event) {
  return event &&
    (typeof event.start == 'number') &&
    (typeof event.end == 'number');
}

//Sort by start, using end to resolve ties
function sortByStartAndEnd(events) {
  return events.sort(function (event1, event2) {
    if (event1.start < event2.start) {
      return -1;
    }
    else if (event2.start < event1.start) {
      return 1;
    }
    else if (event1.end < event2.end) {
      return -1;
    }
    else if (event2.end < event1.end) {
      return 1;
    }
    else {
      return 0;
    }
  });
}

function EventMaker(rawEvent) {
  return {
    start: rawEvent.start,
    end: rawEvent.end,
    widthFactor: 1,
    width: function () {
      return Math.floor(600 * (1 / this.widthFactor));
    },
    order: 0, //horizontal ordinal position
    left: function () {
      return this.width() * this.order;
    },
    right: function () {
      return this.left() + this.width();
    },
    collidesWith: []
  };
}
