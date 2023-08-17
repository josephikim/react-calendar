/**
 * Add an item to a localStorage() object
 * @param {String} name  The localStorage() key
 * @param {String} key   The localStorage() value object key
 * @param {String} value The localStorage() value object value
 */
export const addToLocalStorageObject = (name, key, value) => {
  // Get the existing data
  let existing = localStorage.getItem(name);

  // If no existing data, create an object
  // Otherwise, convert the localStorage string to an object
  existing = existing ? JSON.parse(existing) : {};

  // Add new data to localStorage object
  existing[key] = value;

  // Save back to localStorage
  localStorage.setItem(name, JSON.stringify(existing));
};
