import { createApi } from './createApi.js';
import apiStructure from './api.js';

const { api, socket } = createApi('ws://127.0.0.1:8000', apiStructure);

console.log(api);
// const user = await api.user.read(1);
// console.log(user);

socket?.addEventListener('open', async () => {
  const city = (await api.city.read(3))[0];
  const country = (await api.country.read(city.country))[0];
  console.dir({ city, country });   
});