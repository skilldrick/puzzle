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

function layOutDay(events) {
  if (!_.isArray(events)) {
    throw new TypeError('Events must be an array');
  }
  events = sortByStartAndEnd(events);

  //initialise each event's collidesWith array
  _.each(events, function (event) {
    event.collidesWith = [];
  });

  var organised = [];
  _.each(events, function (event, idx) {
    event.widthDivisor = 1;
    var prevEvents = _.first(events, idx);
    _.each(prevEvents, function (prevEvent) {
      if (collision(prevEvent, event)) {
        prevEvent.collidesWith.push(event);
        event.collidesWith.push(prevEvent);
      }
    });
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

/**
Helper functions
**/

function collision(event1, event2) {
  if (!isEvent(event1) || !isEvent(event2)) {
    throw new TypeError('Both arguments must be events');
  }

  return event1.end > event2.start && event1.start < event2.end
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
