
import axios from 'axios';
import { BASE_URL } from './config';

const mainApi = axios.create({
    baseURL : BASE_URL,
    timeout: 15000,
});

export default mainApi;
