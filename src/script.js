const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt'); // Use a biblioteca MQTT

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  // Conectar-se ao servidor MQTT
  const client = mqtt.connect('mqtt://100.68.13.36');

  // Subscrever-se a um tópico MQTT
  client.subscribe('esp32');

  // Manipulador para receber mensagens do MQTT e enviá-las para o cliente via Socket.io
  client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log('Mensagem recebida do MQTT:', payload);
    io.emit('chat message', payload);
  });

  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou');
    // Desconectar-se do servidor MQTT quando um cliente se desconectar
    client.end();
  });
});

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
