'use strict';

(function() {
    const socket = new WebSocket('ws://127.0.0.1:8000/');
    
    // toDo write scaffold function for http requests
    const scaffold = (structure) => {
      const api = {};
      const services = Object.keys(structure);
      for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
          api[serviceName][methodName] = (...args) => new Promise((resolve) => {
            const packet = { name: serviceName, method: methodName, args };
            socket.send(JSON.stringify(packet));
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              resolve(data);
            };
          });
        }
      }
      return api;
    };
    
    const api = scaffold({
      user: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
        find: ['mask'],
      },
      country: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
      },
      city: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
      }
    });
    
    socket.addEventListener('open', async () => {
      const city = (await api.city.read(3))[0];
      const country = (await api.country.read(city.country))[0];
      console.dir({ city, country });   
    });
})();