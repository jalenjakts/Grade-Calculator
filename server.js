//Required Packages
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const { LookoutEquipment } = require('aws-sdk');
const scripts = require('./db-scripts/getMethods');

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
            var sql = `SELECT * FROM Student s JOIN Grade g ON s.id = g.studentID JOIN Student_Grade sg ON s.id = sg.studentID `
            db.query(sql, (err, data) => {
                if (err) {
                    res.send({
                        "code": 400,
                        "failed": err
                    });
                } else {
                    res.json(data);
                }
            })
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
        var studentName = req.body.studentName;
        var names = studentName.split(' ')
        var firstName = names[0];
        var sql2 = `SELECT id FROM Student WHERE firstName='${firstName}'`;
        db.query(sql2, (err, data) => {
            var studentNumber = data[0].id;
            for (var i = 0; i < req.body.totalCount; i++) {
                var gradeType = req.body.gradeType[i];
                var gradeName = req.body.gradeName[i];
                var gradePercent = req.body.gradePercent[i];
                var gradeValue = req.body.gradeValue[i];
                var sql = `INSERT INTO Grade (studentID,gradeType,gradeName,gradePercent,gradeValue) VALUES('${studentNumber}','${gradeType}','${gradeName}','${gradePercent}','${gradeValue}')`;
                db.query(sql, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Grades were successfully inserted to the db");
                })
            }
        })
        res.redirect('/');
    })

    app.post('/viewGrades', (req, res) => {
        var studentName = req.body.studentName;
        scripts.getStudentNumber(studentName, (data, err) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                var studentNumber = data;
                var sql = `SELECT * FROM Student_Grade WHERE studentID = ${studentNumber}`;
                db.query(sql, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                })
            }
        })
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