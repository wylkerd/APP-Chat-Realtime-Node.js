//tratativa de mostrar um arquivo estático com "express", para rota
const express = require('express');
// usa-se por padrão no node o path
const path = require('path');

/// informando a porta do websocket ///
const app = express(); // aplicativo do express

// definido os dois protocolos 
const server = require('http').createServer(app); // definido o protocolo http
const io = require('socket.io')(server); // definido protocolo wss pro websocket / ele retorna uma função

// definindo pasta onde ficarão os arquivos publicos serão acessados pela aplicação
// e configurações para views como html
app.use(express.static(path.join(__dirname, 'public' ))); // pasta a partir do diretorio atual de nome 'public' 
app.set('views',path.join(__dirname, 'public' )); // onde ficarão as views
app.engine('html', require('ejs').renderFile); //definido a enine como html require ejs (entrada padrão). COMUM NO NODE PARA SE USAR HTML
app.set('view engine','html');

// app.use / que é pra quando ele acessar o endereço do servidor padrão, é pra ele renderizar a view chamada index.html
app.use('/',(req, res) => {
    res.render('index.html');
}) 

//definindo um array para armazenar as mensagens ao invés de usar um BD
let messages = [];

// definindo forma de conexão com o websocket
// toda vez que um cliente se conectar vai receber um socket e dar um console.log com o id
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`); //deve se utilizar a crase

    // carregando mensagens ja enviadas ao atualizar a pagina
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {    
        messages.push(data);
        // mandando mensagem recebida a todos usauarios da aplicação
        socket.broadcast.emit('receivedMessage', data);
    });
   
 });

 
server.listen(3000);





