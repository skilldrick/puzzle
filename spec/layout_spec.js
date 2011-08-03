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
      {id: 3, start: 40, end: 70}
    ];
    layOutDay(events);
  });
});

describe('collision', function () {
  it('requires two event objects', function () {
    expect(function () {
      collision();
    }).toThrow('Both arguments must be events');

    expect(function () {
      collision({}, {});
    }).toThrow('Both arguments must be events');

    expect(function () {
      collision({ start: 100, end: 200 }, { start: 210, end: 250 });
    }).not.toThrow();
  });

  it('returns true if events collide', function () {
    var ev1 = { start: 0, end: 100 };
    var ev2 = { start: 50, end: 150 };
    expect(collision(ev1, ev2)).toBeTruthy();
    expect(collision(ev2, ev1)).toBeTruthy();
  });

  it('returns false if first event end and second start are same', function () {
    var ev1 = { start: 0, end: 50 };
    var ev2 = { start: 50, end: 200 };
    expect(collision(ev1, ev2)).toBeFalsy();
    expect(collision(ev2, ev1)).toBeFalsy();
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
