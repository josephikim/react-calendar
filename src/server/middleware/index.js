import authJwt from './authJwt';
import verifyRegistration from './verifyRegistration';

const middleware = {
  authJwt,
  verifyRegistration
};

export default middleware;