// return serialized slot spanning 24 hours starting at 12:00am of current day
export const getCurrentDaySlot = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    action: 'click',
    start: start.toISOString(),
    end: end.toISOString(),
    slots: [start.toISOString()]
  };
};
