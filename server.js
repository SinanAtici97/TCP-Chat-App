const server = require('net').createServer();

let counter = 0;
let sockets = {};

function timestamp() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

server.on('connection', socket => {
    socket.id = counter++;
    

    console.log('Client connected');
    socket.write('Please type your username: ');

    
    socket.on('data', data => {
        if (!sockets[socket.id]) {
            socket.name = data.toString().trim();
            socket.write(`Welcome ${socket.name} !\n`);
            sockets[socket.id] = socket;
            return;
        }

        Object.entries(sockets).forEach(([key, cs]) => {
            if (socket.id == key) return;
            cs.write(`(${timestamp()}) ${socket.name} : `);
            cs.write(data);
        });
    });

    socket.on('end', () => {
        delete sockets[socket.id];
        console.log('Client disconnected');
    });

    
});

server.listen(9090, () => console.log('Server bound'));