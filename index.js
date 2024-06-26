const langParser = (pattern, string) => {
  const matchyear = /yearly/.test(string);
  const matchweek = /weekly/.test(string);
  const matchmonth = /monthly/.test(string);
  const matchquarter = /quarterly/.test(string);
  if (matchyear) {
    return pattern.map((e, idx) => {
      if ([3, 4].indexOf(idx) > -1) {
        return 1;
      } else if (idx === 5) {
        // no days allowed on year
        return '*';
      } else {
        return e === '*' ? 0 : e;
      }
    });
  }

  if (matchweek) {
    pattern[3] = '*/7';
    let changed = false;
    return pattern.map((e, idx) => {
      if (idx < 3 && e === '*' && !changed) {
        return 0;
      } else if (idx === 5) {
        return '*';
      }
      changed = true;
      return e;
    });
  }

  if (matchmonth) {
    pattern[4] = '*/1';
    pattern[3] = pattern[5] !== '*' ? '*' : '1';
    let changed = false;
    return pattern.map((e, idx) => {
      if (idx < 3 && e === '*' && !changed) {
        return 0;
      }
      changed = true;
      return e;
    });
  }

  if (matchquarter) {
    pattern[4] = '*/3';
    let changed = false;
    return pattern.map((e, idx) => {
      if (idx < 3 && e === '*' && !changed) {
        return 0;
      }
      changed = true;
      return e;
    });
  }
  return pattern;
};

const dayParser = (pattern, string) => {
  const daymatch = string.match(
    /(\d+)? (sun|mon|tue|wed|thu|fri|sat|weekends|workdays)/g
  );

  if (daymatch) {
    const day = daymatch[0].trim();
    if (day === 'workdays') {
      pattern[5] = '1-5';
    } else if (day === 'weekends') {
      pattern[5] = '6,0';
    } else {
      const days = daymatch.map((i) =>
        ['', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(i.trim())
      );
      if (days.length) {
        pattern[5] = days.sort((a, b) => a - b).join(',');
      }
    }
    let changed = false;
    return pattern.map((e, idx) => {
      if (idx <= 2 && e === '*' && !changed) {
        return 0;
      } else {
        changed = true;
        return e;
      }
    });
  }
  return pattern;
};

const dateParser = (pattern, string) => {
  const from = /from\s([0-9]{1,2})\sthrough\s([0-9]{1,2})/.exec(string);
  const full =
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec) ([0-9]{1,2})/.exec(
      string
    );
  const monthMatch = string.match(
    /(\d+)? (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g
  );
  const months = [
    '',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];

  if (full) {
    pattern[3] = full[2];
    pattern[4] = months.indexOf(full[1]);
  } else if (monthMatch) {
    const mon = monthMatch
      .map((i) => months.indexOf(i.trim()))
      .sort((a, b) => a - b);
    if (mon.length) {
      pattern[4] = mon.join(',');
    }
  }

  if (!full && from) {
    pattern[3] = `${from[1]}-${from[2]}`;
    pattern[5] = '*';
  }

  return pattern;
};

const timeParser = (pattern, string) => {
  const time = /([0-9]{1,2}):([0-9]{2}):?([0-9]{0,2})?/.exec(string);
  if (time) {
    pattern[0] = time[3] ? parseInt(time[3], 10) : 0;
    pattern[1] = parseInt(time[2], 10);
    pattern[2] = parseInt(time[1], 10);
  }
  return pattern;
};

const intervalParser = (pattern, string) => {
  const match = string.match(/(\d+)? (second|minute|hour|day|month)/);
  const places = ['second', 'minute', 'hour', 'day', 'month'];

  if (match) {
    const count = match[1] || 1;
    const interval = match[2];
    const intervalPlace = places.indexOf(interval);
    if (count !== 1) {
      pattern[intervalPlace] = `*/${count}`;
    }
    for (let i = intervalPlace - 1; i >= 0; i--) {
      pattern[i] = 0;
    }
  }

  return pattern;
};

const translate = (arg) => {
  const string = arg.trim().toLowerCase();
  const equalsNull = '* * * * * *';
  let pattern = Array(6).fill('*');

  if (!/(\s*?)at\s/.test(string)) {
    pattern = intervalParser(pattern, string);
  } else {
    pattern = timeParser(pattern, string);
  }
  pattern = dayParser(pattern, string);
  pattern = dateParser(pattern, string);
  pattern = langParser(pattern, string);
  const patternString = pattern.join(' ');
  return patternString === equalsNull ? null : patternString;
};

module.exports = translate;
