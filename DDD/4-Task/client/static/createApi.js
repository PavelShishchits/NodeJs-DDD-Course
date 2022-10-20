const scaffoldIterator = (structure, handler) => {
  const api = {};
  const services = Object.keys(structure);

  for (const serviceName of services) {
    api[serviceName] = {};
    const serviceMethods = Object.keys(structure[serviceName]);
    for (const serviceMethod of serviceMethods) {
       api[serviceName][serviceMethod] = handler(serviceName, serviceMethod);
    }
  }

  return api;
}

const scaffoldWs = (url, structure) => {
  const socket = new WebSocket(url);

  const api = scaffoldIterator(structure, (serviceName, serviceMethod) => (...args) => {
    return new Promise((resolve) => {
      const packet = { name: serviceName, method: serviceMethod, args };
      socket.send(JSON.stringify(packet));
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        resolve(data);
      };
    });
  })

  return new Promise((resolve) => {
    socket.addEventListener('open', () => {
      resolve(api);
    })
  });
}

const scaffoldHttp = (url, structure) => {
  const api = scaffoldIterator(structure, (serviceName, serviceMethod) => (...args) => {
    return fetch(`${url}/${serviceName}/${serviceMethod}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: args }),
    })
        .then((response) => response.json());
  })

  return Promise.resolve(api);
}

const transportsCollection = {
  http: scaffoldHttp,
  ws: scaffoldWs,
  default: scaffoldHttp,
}

export const scaffold = (url, structure) => {
  const transport = url.substring(0, url.indexOf('://'));
  return (transportsCollection[transport] || transportsCollection['default'])(url, structure);
}