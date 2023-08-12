export const getErrorMessage = (error) => {
  const response = error.response;
  return response?.data?.message ?? error.message;
};
