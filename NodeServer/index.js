var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));
var cred = require('./secrets.js');
console.log(cred);

var con = mysql.createConnection({
    host: cred.host,
    user: cred.user,
    password: cred.password,
    database: cred.database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/api/add_donor', function(req, res) {
    const data = req.body;
    con.query(`INSERT INTO users (firstname, school, amount, recurring, businessOrNot, businessdescription) VALUES (${data.fname}, ${data.school}, ${data.amount}, ${data.donation_freq}. ${data.has_business}, ${data.business_descr}`, function(err, result){
        if (err) {
            console.log(err);
        }
    });
    res.status(200).send();
});