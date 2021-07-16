export const tokenSaved = () => {
  if (localStorage.getItem('SavedToken') !== null) {
    return true;
  } else {
    setTimeout(tokenSaved, 200);
  }
}