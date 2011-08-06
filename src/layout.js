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
  var events = _.map(rawEvents, EventMaker);

  //Tell each event which earlier events it collides with
  setCollidesWith(events);

  _.each(events, function (event, idx) {
    if (idx === 0) {
      return;
    }

    //event's width should match its colliders
    if (event.collidesWith.length > 0) {
      event.widthFactor = event.collidesWith[0].widthFactor;
    }
    //if event fits
    if (! event.willCollideInSpace()) {
      return;
    }
    //otherwise
    //check if it fits at any other order
    var itFits = _.any(_.range(event.widthFactor - 1), function (order) {
      event.order = order;
      return _.all(event.collidesWith, function (other) {
        //at this order it fits!
        return ! spaceCollision(event, other);
      });
    });
    
    if (itFits) {
      return;
    }
    //otherwise:
    //go through each event in colliding group and reduce its size
    _.each(event.collidingGroup(), function (event) {
      event.widthFactor += 1;
    });

    itFits = _.any(_.range(event.widthFactor), function (order) {
      event.order = order;
      return _.all(event.collidesWith, function (other) {
        //at this order it fits!
        return ! spaceCollision(event, other);
      });
    });
    
    if (itFits) {
      return;
    }

    throw "Shouldn't get here!";

  });


  console.log(events);
  return events;

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
        event.collidesWith.push(prevEvent);
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
    collidesWith: [],
    willCollideInSpace: function () { //will collide in space
      return _.any(this.collidesWith, function (other) {
        return spaceCollision(this, other);
      }, this);
    },
    collidingGroup: function () {
      var allColliders = _.map(this.collidesWith, function (item) {
        return item.collidingGroup();
      });
      allColliders = _(allColliders).chain().flatten().uniq().value();
      allColliders.push(this);
      return allColliders;
    }
  };
}
