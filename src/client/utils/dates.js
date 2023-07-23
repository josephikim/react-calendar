// returns given date with time set to 12:00am
export const getDayStart = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// returns day following given date with time set to 12:00am
export const getDayEnd = (date) => {
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);
  return end;
};

// returns given date with time at first hour following current hour
export const getSmartStart = (date) => {
  const start = new Date(date);
  const current = new Date();
  start.setHours(current.getHours() + 1, 0, 0, 0);
  return start;
};

// returns given date with time at second hour following current hour
export const getSmartEnd = (date) => {
  const end = new Date(date);
  const current = new Date();
  end.setDate(end.getDate() - 1);
  end.setHours(current.getHours() + 2, 0, 0, 0);
  return end;
};

export const getAllDayStart = (isEventSelected, currentSelection) => {
  if (isEventSelected) {
    return getDayStart(currentSelection.event.start);
  } else {
    return getDayStart(currentSelection.slot.start);
  }
};

export const getAllDayEnd = (isEventSelected, currentSelection) => {
  if (isEventSelected) {
    if (currentSelection.event.allDay === true) {
      // all day event
      return currentSelection.event.end;
    }
    return getDayEnd(currentSelection.event.end);
  } else {
    if (isAllDaySpan(currentSelection.slot.start, currentSelection.slot.end)) {
      // all day slot
      return currentSelection.slot.end;
    }
    return getDayEnd(currentSelection.slot.end);
  }
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

// check if start and end both equal 12:00am
export const isAllDaySpan = (start, end) => {
  if (
    ((start.getHours() == start.getMinutes()) == start.getSeconds()) == 0 &&
    ((end.getHours() == end.getMinutes()) == end.getSeconds()) == 0 &&
    start.getTime() != end.getTime()
  ) {
    return true;
  }
  return false;
};

// check if start and end both equal 12:00am exactly 24 hours apart
export const isSingleDayAllDaySpan = (start, end) => {
  if (isAllDaySpan(start, end) && end.getTime() - start.getTime() === 86400000) {
    return true;
  }
  return false;
};
