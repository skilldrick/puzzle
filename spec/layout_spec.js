describe('layOutDay', function () {
  it('requires an array of events', function () {
    expect(function () {
      layOutDay();
    }).toThrow('Events must be an array');
  });

  it('does something', function () {
    var events = [
      {id: 0, start: 10, end: 40},
      {id: 1, start: 20, end: 50},
      {id: 2, start: 30, end: 50},
      {id: 3, start: 40, end: 70},
      {id: 4, start: 60, end: 80}
    ];
    layOutDay(events);
  });
});

describe('spaceCollision', function () {
  it('returns false if events only collide by time', function () {
    var ev1 = EventMaker({ start: 0, end: 100});
    ev1.widthFactor = 2;
    var ev2 = EventMaker({ start: 50, end: 150});
    ev2.order = 1;
    ev2.widthFactor = 2;
    expect(spaceCollision(ev1, ev2)).toBeFalsy();
  });

  it('returns true if events collide by space', function () {
    var ev1 = EventMaker({ start: 0, end: 100});
    var ev2 = EventMaker({ start: 50, end: 150});
    ev2.order = 1;
    ev2.widthFactor = 2;
    expect(spaceCollision(ev1, ev2)).toBeTruthy();
  });
});

describe('Event#collidingGroup', function () {
  it('returns a list of all previous colliders', function () {
    var rawEvents = [
      {start: 0, end: 30},
      {start: 40, end: 70},
      {start: 60, end: 90},
      {start: 80, end: 100}
    ];
    var events = _.map(rawEvents, EventMaker);
    setCollidesWith(events);
    var colliders = events[3].collidingGroup();
    expect(colliders.length).toEqual(3);
  });
});

describe('timeCollision', function () {
  it('requires two event objects', function () {
    expect(function () {
      timeCollision();
    }).toThrow('Both arguments must be events');

    expect(function () {
      timeCollision({}, {});
    }).toThrow('Both arguments must be events');

    expect(function () {
      timeCollision({ start: 100, end: 200 }, { start: 210, end: 250 });
    }).not.toThrow();
  });

  it('returns true if events collide', function () {
    var ev1 = { start: 0, end: 100 };
    var ev2 = { start: 50, end: 150 };
    expect(timeCollision(ev1, ev2)).toBeTruthy();
    expect(timeCollision(ev2, ev1)).toBeTruthy();
  });

  it('returns false if first event end and second start are same', function () {
    var ev1 = { start: 0, end: 50 };
    var ev2 = { start: 50, end: 200 };
    expect(timeCollision(ev1, ev2)).toBeFalsy();
    expect(timeCollision(ev2, ev1)).toBeFalsy();
  });
});

describe('sortByStartAndEnd', function () {
  it('sorts an array of events by start and end', function () {
    var unsorted = [
      { start: 50, end: 150 },
      { start: 50, end: 100 },
      { start: 25, end: 125 },
      { start: 60, end: 90 },
      { start: 100, end: 120 },
      { start: 60, end: 100 }
    ];
    var expectedSorted = [
      { start: 25, end: 125 },
      { start: 50, end: 100 },
      { start: 50, end: 150 },
      { start: 60, end: 90 },
      { start: 60, end: 100 },
      { start: 100, end: 120 }
    ];

    expect(sortByStartAndEnd(unsorted)).toEqual(expectedSorted);
  });
});
