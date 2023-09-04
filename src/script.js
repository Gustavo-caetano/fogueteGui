const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/:peso',(req, res)=> {
  const Peso = req.params.peso;

  io.emit('chat message',Peso.toString())
  res.send(`Recebido o valor "peso" da URL: ${Peso}`);
})

io.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  const client = mqtt.connect('mqtt://100.68.13.36', {
    username: 'gustavo',
    password: '3141516'
  });

  client.on('connect', () => {
    console.log('Conexão MQTT estabelecida com sucesso');
  });

  client.on('error', (error) => {
    console.error('Erro de conexão MQTT:', error.message);
    io.emit('chat message', 'Erro de conexão MQTT: ' + error.message);
  });
  
  client.subscribe('esp32_data');

  client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log('Mensagem recebida do MQTT:', payload);
    io.emit('chat message', payload);
  });

  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou');

    client.end();
  });
});

server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
