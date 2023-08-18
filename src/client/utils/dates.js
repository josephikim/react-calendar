// returns given date with time set to 12:00am
export const getDayStart = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// returns day following given date with time set to 12:00am
export const getDayEnd = (date) => {
  // if time is 12:00, return date as is
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    return date;
  }

  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);
  return end;
};

// checks if start time is before end time
export const isValidStartTime = (start, end) => {
  if (start.getTime() > end.getTime()) {
    return false;
  }
  return true;
};

// checks if end time is after start time
export const isValidEndTime = (start, end) => {
  if (end.getTime() <= start.getTime()) {
    return false;
  }
  return true;
};

// returns true if start and end both equal 12:00am
export const isAllDaySpan = (start, end) => {
  if (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    start.getSeconds() === 0 &&
    end.getHours() === 0 &&
    end.getMinutes() === 0 &&
    end.getSeconds() === 0 &&
    start.getTime() !== end.getTime()
  ) {
    return true;
  }
  return false;
};
