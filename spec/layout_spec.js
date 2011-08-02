describe('layOutDay', function () {
  it('requires an array of events', function () {
    expect(function () {
      layOutDay();
    }).toThrow('Events must be an array');
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
