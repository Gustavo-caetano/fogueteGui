const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Manipulador de eventos de conexão
io.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  // Manipulador para o evento personalizado "chat message"
  socket.on('chat message', (msg) => {
    console.log('Mensagem recebida: ' + msg);

    // Enviar a mensagem para todos os clientes, incluindo o remetente
    io.emit('chat message', msg);
  });

  // Manipulador de eventos de desconexão
  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou');
  });
});

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
