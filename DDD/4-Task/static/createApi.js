const crudMap = {
  create: 'POST',
  read: 'GET',
  update: 'PUT',
  delete: 'DELETE',
  find: 'GET',
};

const createApiMethodHttp = ({ url, serviceName, methodName, argsSignature = [] }) => async(...args) => {
  const method = crudMap[methodName] || 'GET';
  const id = args[argsSignature.indexOf('id')];
  const record = args[argsSignature.indexOf('record')];

  return fetch(`${url}/${serviceName}/${id || ''}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(record ? {
      body: JSON.stringify(record),
    } : {}),
  })
    .then((response) => response.json());
}

const createApiMethodWs = ({ serviceName, methodName, socket }) => (...args) => {
  return new Promise((resolve) => {
    const packet = { name: serviceName, method: methodName, args };
    socket.send(JSON.stringify(packet));
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      resolve(data);
    };
  })
};

const createApiMethodMap = {
  http: createApiMethodHttp,
  ws: createApiMethodWs,
  default: createApiMethodHttp,
}

export const createApi = (url, structure) => {
  const api = {};
  const transport = url.substring(0, url.indexOf('://'));
  const services = Object.keys(structure);
  const method = createApiMethodMap[transport] || createApiMethodMap.default;
  const socket = transport === 'ws' ? new WebSocket(url) : null; 

  for (const serviceName of services) {
    api[serviceName] = Object.entries(structure[serviceName]).reduce((accumulator, [methodName, requestParams]) => {
      return {
        ...accumulator,
        [methodName]: method({
          url: url,
          serviceName: serviceName,
          methodName: methodName,
          argsSignature: requestParams,
          socket: socket,
        }),
      };
    }, {});
  }

  return {
    api,
    socket,
  };
}