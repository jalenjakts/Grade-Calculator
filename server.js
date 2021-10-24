//Required Packages
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

//App Routing Configuration
const create = async() => {
    const app = express();
    app.set("view engine", "ejs");
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));

    //Index Page for App
    app.get('/', (req, res) => {
        try {
            res.render("home");
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    // Page for Student
    app.get('/newUser', (req, res) => {
        try {
            res.render("newUser");
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    //Page for Adding new grades for Student
    app.get('/addGrades', (req, res) => {
        try {
            var sql = 'SELECT firstName, lastName FROM Student';
            db.query(sql, (err, data, fields) => {
                if (err) {
                    throw err;
                }
                res.render("addGrades", { title: 'Student List', studentData: data });
            })
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    //Page for Viewing the Student Grades
    app.get('/viewGrades', (req, res) => {
        try {
            var sql = 'SELECT * FROM Student';
            db.query(sql, (err, data, fields) => {
                if (err) {
                    throw err;
                }
                res.render("viewGrades", { title: 'Student List', studentData: data });
            })
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    //Page to view the tables of the Database
    app.get('/viewDatabase', (req, res) => {
        try {
            const student = connection.query('SELECT * FROM Student', (err) => {
                if (err) {
                    res.send({
                        "code": 400,
                        "failed": "error occurred"
                    });
                    console.log(err);
                } else {
                    res.render("viewDataBase");
                    res.send(student);
                }
            });
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    //Post for submitting a new student
    app.post('/newUser', (req, res) => {
        const userDetails = req.body;
        var sql = 'INSERT INTO Student SET ?';
        db.query(sql, userDetails, (err, data) => {
            if (err) {
                throw err;
            }
            console.log("User is successfully inserted to the db");
        })
        res.redirect('/');
    });

    //Post for New Grades
    app.post('/addGrades', (req, res) => {
        res.redirect('/');
    })
    return app;
}

const PORT = process.env.PORT || 3000;
create().then(app => {
    app.listen(PORT, () => {
        console.log(`Server has started on port http://localhost:${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}).catch(err => console.log(err));