import axios from 'axios';

axios.interceptors.request.use(
  function (req) {
    console.log('interceptor is here: ', req);
    return req;
  },
  function (error) {
    return Promise.reject(error);
  },
);
