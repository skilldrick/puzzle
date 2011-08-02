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
