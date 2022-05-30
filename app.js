// dependencies
const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('dotenv'). config();

// database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_crud'
});

// set views file
app.set('views', path.join(__dirname, 'views'));

// set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// showing our data from database / Home Page
app.get('/', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('user_index', {
            title: 'Crud Operation using NodeJs / Expressjs / MySQL',
            users: rows
        });
    });
});


// handle our HTTP POST request and store the New User Form data to the database
app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'Crud Operation using NodeJs / Expressjs / MySQL'
    });
});

app.post('/save', (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no
    };
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data, (err, resilts) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// handle our HTTP GET request and fetch the User information from the database
app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('user_edit', {
            title: 'Crud Operation using NodeJs / Expressjs / MySQL',
            user: result[0]
        });
    });
});

// update the User Form data to the database based on unique user ID
app.post('/update', (req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Remove or Delete user information from a database using a unique user ID
app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

connection.connect(function(error) {
    if (!!error) console.log(error);
    else console.log('Databse Connected');
})

// server listening
app.listen(process.env.PORT, () => {
    console.log('Server is running at port 3000');
});