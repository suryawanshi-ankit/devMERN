const express = require('express');

const app = express();

app.use('/hello', (req, res) => {
    console.log('Hello route')
    res.send('Hello route');
});

app.use('/test', (req, res) => {
    console.log('test route')
    res.send('test route');
});

app.use('/', (req, res) => {
    console.log('Hello from the server');
    res.send('Hello from the server');
});

app.listen(3000, () => console.log('server is listening on 30000'));