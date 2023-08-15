export const isValidEventUpdate = (event, update) => {
  const isValidUpdate =
    event.title != update.title ||
    event.desc != update.desc ||
    event.start.toISOString() != update.start ||
    event.end.toISOString() != update.end ||
    event.allDay != update.allDay ||
    event.calendar != update.calendar;

  if (isValidUpdate) {
    return true;
  }
  return false;
};
