/**
Lays out events for a single day
 
@param array  events  
An array of event objects. Each event object consists of a start
time, end time (measured in minutes) from 9am, as well as a unique
id. The start and end time of each event will be [0, 720]. The start
time will be less than the end time.  The array is not sorted.
 
@return array
An array of event objects that has the width, the left and top
positions set, In addition to start time, end time, and id. 

  This algorithm works like so:
  1. Put the events in order
  2. Give each event a list of earlier events it collides with in time
  3. Tell each event to find its correct location
    a) Set the event's width to the width of its colliders
    b) Try the event in all possible horizontal locations. If it fits,
       leave it there
    c) If it doesn't fit in any, reduce the width of this event and
       all previous events it collides with (and the events that those
       events collide with, recursively), then do b) again
  
  The width and left edge of each event is calculated lazily from the
  order and widthDivisor of that event. The order is the 'column' the
  event is in, and the widthDivisor is the proportion of the full
  width. Because all events in a colliding group have the same width, we
  don't have to recalculate the width and left edge each time the
  number of events in a row changes - the width and left values
  are fully described by the order and widthDivisor values.
 
**/

function layOutDay(rawEvents) {
  if (!_.isArray(rawEvents)) {
    throw new TypeError('Events must be an array');
  }

  //create intelligent event objects
  var events = _.map(rawEvents, EventMaker);
  //and sort them
  events = sortByStartAndEnd(events);

  //Tell each event which earlier events it collides with
  setCollidesWith(events);

  //Tell each event to find its correct location
  _.invoke(events, 'findCorrectLocation');

  //Should return an array of simple error objects
  return _.invoke(events, 'simplify');
}

function render(events) {
  var eventHtml = [
    '<div class="event">',
    '<p class="title">Sample Item</p>',
    '<p class="location">Sample Location</p>',
    '</div>'
  ].join('\n');

  var $calendar = $('#calendar');
  $calendar.empty();

  _.each(events, function (event) {
    $(eventHtml).css({
      height: (event.end - event.start) - 2,
      width: event.width - 5,
      top: event.start,
      left: event.left + 10
    }).appendTo($calendar);
  });
}

/**
Helper functions
**/

function setCollidesWith(events) {
  _.each(events, function (event, idx) {
    var prevEvents = _.first(events, idx); //first n events

    _.each(prevEvents, function (prevEvent) {
      if (timeCollision(prevEvent, event)) {
        event.previousColliders.push(prevEvent);
      }
    });
  });
}

function timeCollision(event1, event2) {
  if (!isEvent(event1) || !isEvent(event2)) {
    throw new TypeError('Both arguments must be events');
  }

  return event1.end > event2.start &&
    event1.start < event2.end
}

function spaceCollision(event1, event2) {
  if (!timeCollision(event1, event2)) {
    return false;
  }

  return event1.right() > event2.left() &&
    event1.left() < event2.right();
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
  var CALENDAR_WIDTH = 600;

  return {
    start: rawEvent.start,
    end: rawEvent.end,
    id: rawEvent.id,
    widthDivisor: 1, //1: full width, 2: half-width, etc.
    order: 0, //horizontal ordinal position
    //These are the previous events this event collides with in time
    previousColliders: [],

    width: function () {
      return Math.floor(CALENDAR_WIDTH * (1 / this.widthDivisor));
    },

    left: function () {
      return this.width() * this.order;
    },

    right: function () {
      return this.left() + this.width();
    },

    fits: function () {
      return _.all(this.previousColliders, function (other) {
        return !spaceCollision(this, other);
      }, this);
    },

    //These are the previous events that (a) this event collides with
    //in time and (b) the colliders collide with. All events in a
    //colliding group should be the same width
    collidingGroup: function () {
      var allColliders = _.map(this.previousColliders, function (item) {
        return item.collidingGroup();
      });
      //this will be a nested array with dupes so flatten and uniq
      allColliders = _(allColliders).chain().flatten().uniq().value();
      allColliders.push(this);
      return allColliders;
    },

    //This and all previous colliders should have the same width
    setWidthToColliders: function () {
      if (this.previousColliders.length > 0) {
        this.widthDivisor = this.previousColliders[0].widthDivisor;
      }
    },

    //Try out each order and return true if one fits
    tryToFit: function () {
      for (order = 0; order < this.widthDivisor; order++) {
        this.order = order;
        if (this.fits()) {
          return true;
        }
      }

      return false;
    },

    //Increase widthDivisor for all events in collidingGroup
    reduceWidthOfGroup: function () {
      _.each(this.collidingGroup(), function (event) {
        event.widthDivisor += 1;
      });
    },

    //This is called on each event. It tries all the possible
    //locations for the event until one fits. If that doesn't work
    //it reduces the width of all the events in the colliding group,
    //then tries to fit it again. If *that* doesn't work then there's
    //an error in the algorithm, so throw an error.
    findCorrectLocation: function () {
      //event's width should match its colliders
      this.setWidthToColliders();

      if (this.tryToFit()) {
        return;
      }

      //If we get here, the event must be too wide.
      this.reduceWidthOfGroup();

      if (this.tryToFit()) {
        return;
      }

      throw "Shouldn't get here!";
    },

    simplify: function () {
      return {
        width: this.width(),
        left: this.left(),
        start: this.start,
        end: this.end,
        id: this.id
      };
    }
  };
}
