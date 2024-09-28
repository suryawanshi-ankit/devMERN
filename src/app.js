const express = require('express');

const app = express();

app.get('/user', (req, res) => {
    console.log('test route')
    res.send({
        fname: 'ankit',
        lname: 'suryawanshi'
    });
});

app.post('/user', (req, res) => {
    res.send('New user created');
});

app.delete('/user', (req, res) => {
    res.send('User deleted');
});

app.use('/test', (req, res) => {
    console.log('test route')
    res.send('test route');
});

app.listen(3000, () => console.log('server is listening on 30000'));