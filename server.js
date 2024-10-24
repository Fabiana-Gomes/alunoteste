const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const port = 3001; // Porta para a aplicação do instrutor
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Novo aluno conectado');

        // Lógica para receber a stream do aluno
        socket.on('stream', (data) => {
            // Envia a stream para o instrutor
            socket.broadcast.emit('screenShare', data); 
        });

        // Lógica para receber mensagens de teste
        socket.on('testMessage', (message) => {
            console.log('Mensagem recebida do aluno:', message);
            // Aqui você pode emitir a mensagem para a interface do instrutor, se necessário
            socket.broadcast.emit('displayMessage', message); // Opcional: enviar a mensagem para todos os instrutores conectados
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`Servidor do instrutor ouvindo na porta ${port}`);
    });
});
