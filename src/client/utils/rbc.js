// returns start and end date objects with times spanning one hour starting at nearest upcoming hour relative to current time
// input date defaults to current date
export const getSmartDates = (startDate = new Date()) => {
  let start = new Date(startDate);
  let end = new Date(startDate);
  let now = new Date();
  start.setHours(now.getHours() + 1, 0, 0, 0);
  end.setHours(now.getHours() + 2, 0, 0, 0);

  return {
    start,
    end
  };
};
