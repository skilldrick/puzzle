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

  // create intelligent event objects
  var events = _.map(rawEvents, EventMaker);
  events = sortByStartAndEnd(events);

  //Tell each event which earlier events it collides with
  setCollidesWith(events);

  _.invoke(events, 'findCorrectLocation');

  return events;
}

function render(events) {
  $calendar = $('#calendar');
  $calendar.empty();
  _.each(events, function (event) {
    var $ev = $('<div class="event" />');
    $ev.css('height', event.end - event.start);
    $ev.css('width', event.width() - 5);
    $ev.css('top', event.start);
    $ev.css('left', event.left() + 10);
    $calendar.append($ev);
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
  return {
    start: rawEvent.start,

    end: rawEvent.end,

    id: rawEvent.id,

    widthDivisor: 1, //1: full width, 2: half-width, etc.

    width: function () {
      return Math.floor(600 * (1 / this.widthDivisor));
    },

    order: 0, //horizontal ordinal position

    left: function () {
      return this.width() * this.order;
    },

    right: function () {
      return this.left() + this.width();
    },

    //These are the previous events this event collides with in time
    previousColliders: [],

    fits: function () {
      return _.all(this.previousColliders, function (other) {
        return !spaceCollision(this, other);
      }, this);
    },

    //These are the events that (a) this event collides with in time
    //and (b) the colliders collide with. All events in a colliding
    //group should be the same width
    collidingGroup: function () {
      var allColliders = _.map(this.previousColliders, function (item) {
        return item.collidingGroup();
      });
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
    //locations for the event until one fits. Order always starts
    //at 0, and widthDivisor at 1, so we can make certain assumptions
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
    }
  };
}
