export const getErrorMessage = (error) => {
  const errorData = error.response?.data;
  return errorData.message ?? error.message;
};
