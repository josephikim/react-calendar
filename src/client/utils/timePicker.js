// return array with hour and min values from input timestring
export const parseTimePickerValues = (timeStr) => {
  const arr = timeStr.split(':');
  if (arr.length < 2) alert('Invalid time entered!');

  const hour = parseInt(arr[0]);
  const min = parseInt(arr[1]);
  return [hour, min];
};
