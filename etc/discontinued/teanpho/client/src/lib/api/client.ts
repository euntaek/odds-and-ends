import axios from 'axios';
import { API_ENDPOINT } from '../constants';

const client = axios.create();

client.defaults.baseURL = API_ENDPOINT;
export default client;
