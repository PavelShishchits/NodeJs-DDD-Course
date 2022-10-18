import { createApi } from './createApi.js';
import apiStructure from './api.js';

const { api, socket } = createApi('http://127.0.0.1:6001', apiStructure);


window.api = window.api || api;
console.log(api);

socket?.addEventListener('open', async () => {
  const city = (await api.city.read(3))[0];
  const country = (await api.country.read(city.country))[0];
  console.dir({ city, country });   
});