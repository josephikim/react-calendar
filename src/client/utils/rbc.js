// return serialized slot spanning 60 minutes starting at nearest upcoming hour
export const getSmartSlot = () => {
  const start = new Date();
  const end = new Date();
  start.setHours(start.getHours() + 1, 0, 0, 0);
  end.setHours(end.getHours() + 2, 0, 0, 0);

  return {
    action: 'click',
    start: start.toISOString(),
    end: end.toISOString(),
    slots: [start.toISOString()]
  };
};
