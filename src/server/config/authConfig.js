const SECRET = 'mysecretkey';
// const JWT_EXPIRATION = 3600;           // 1 hour
// const JWT_REFRESH_EXPIRATION = 86400;  // 24 hours

/* for testing */
const JWT_EXPIRATION = 60; // 1 minute
const JWT_REFRESH_EXPIRATION = 120; // 2 minutes

const config = {
  SECRET,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION
};

export default config;
