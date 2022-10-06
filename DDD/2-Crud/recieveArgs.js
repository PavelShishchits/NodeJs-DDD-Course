import { Buffer } from 'node:buffer';

// вычитывает из сокета все буферы, склеить их, и распарсить в JSON
const recieveArgs = async (req) => {
    const buffers = [];
    // req реализует протокол асинхронной итерации (async iterable)
    for await (const chunk of req) {
        buffers.push(chunk);
    };
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

export default recieveArgs;