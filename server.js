'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

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

    //Page for Viewing the Student Grades
    app.get('/viewGrades', (req, res) => {
        try {
            res.render("viewGrades");
        } catch (err) {
            res.status(500).send('Unable to load page. Please fix the code').end();
        }
    });

    //Page for Adding new grades for Student
    app.get('/addGrades', (req, res) => {
        try {
            res.render("addGrades");
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
        console.log({
            student_id: req.body.studentID,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            school_year: req.body.year,
            email: req.body.email
        });
        res.redirect('/');
    });

    //Post for New Grades
    app.post('/addGrades', (req, res) => {
        for (var i = 1; i < req.body.totalCount; i++) {
            // console.log(
            //     "gradeType: " + req.body.gradeType + i + "\n" +
            //     "gradeName: " + req.body.gradeName + i + "\n" +
            //     "gradePercent: " + req.body.gradePercent + i + "\n" +
            //     "gradeValue: " + req.body.gradeValue + i + "\n"
            // );
            console.log({
                gradeType: req.body.gradeType1,
                gradeName: req.body.gradeName1,
                gradePercent: req.body.gradePercent1,
                gradeValue: req.body.gradeValue1
            });
        }
        res.redirect('/');
    })
    return app;
}

const PORT = process.env.PORT || 3000;
const uri = 'https://woven-solution-326720.uk.r.appspot.com/';

create().then(app => {
    app.listen(PORT, () => {
        if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === "production") {
            console.log(`Browse to ${uri}.`);
        }
        console.log(`Server has started on port http://localhost:${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}).catch(err => console.log(err));