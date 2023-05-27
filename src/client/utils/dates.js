export const getDayStart = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getDayEnd = () => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 1);
  return end;
};

export const getSmartStart = () => {
  const start = new Date();
  start.setHours(start.getHours() + 1, 0, 0, 0);
  return start;
};

export const getSmartEnd = () => {
  const end = new Date();
  end.setHours(end.getHours() + 2, 0, 0, 0);
  return end;
};

export const isValidEndTime = (start, end) => {
  if (end.getTime() <= start.getTime()) {
    return false;
  }
  return true;
};

export const isAllDaySpan = (start, end) => {
  if (
    ((start.getHours() == start.getMinutes()) == start.getSeconds()) == 0 &&
    ((end.getHours() == end.getMinutes()) == end.getSeconds()) == 0
  ) {
    return true;
  }
  return false;
};
