const express = require('express');

const app = express();

app.use('/user',
    (req, res, next) => {
        console.log('user 1St route')
        next();
        // res.send('1st route');
    },
    (req, res, next) => {
        console.log('user 2nd route');
        next();
        // res.send('2nd route');
    },
    (req, res, next) => {
        console.log('user 3rd route');
        next();
        // res.send('3rd route');
    },
    (req, res, next) => {
        console.log('user 4th route');
        next();
        res.send('4th route');
    },
    (req, res, next) => {
        console.log('user 5th route');
        next();
        res.send('5th route');
    },
);

app.listen(3000, () => console.log('server is listening on 30000'));