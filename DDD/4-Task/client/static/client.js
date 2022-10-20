import { scaffold as scaffoldApi } from './createApi.js';
import apiStructure from './api.js';

const api = await scaffoldApi('http://127.0.0.1:6001', apiStructure);

window.api = window.api || api;

const user3 = await api.user.read(3);

console.log(user3);