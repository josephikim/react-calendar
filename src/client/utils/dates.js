// returns given date with time set to 12:00am
export const getDayStart = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// returns day following given date with time set to 12:00am
export const getDayEnd = (date) => {
  // if time is 12:00, return date as is
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    return date;
  }

  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);
  return end;
};

// returns true if start time is before end time
export const isValidTimeSpan = (start, end) => {
  if (start.getTime() >= end.getTime()) {
    return false;
  }
  return true;
};

// returns true if start and end both equal 12:00am
export const isAllDaySpan = (start, end) => {
  if (
    start.getTime() < end.getTime() &&
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 0 &&
    end.getMinutes() === 0
  ) {
    return true;
  }
  return false;
};

// returns local IANA time zone string
export const getLocalTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
};
