const e = require('express');
const db = require('../database');

function getStudentNumber(studentName, callback) {
    var names = studentName.split(' ')
    var firstName = names[0];
    var sql = `SELECT id FROM Student WHERE firstName='${firstName}'`;
    db.query(sql, (err, data) => {
        if (err)
            callback(err, null);
        else
            callback(data[0].id);
    })
}

function getGradeLetter(gradeTotal, callback) {
    switch (true) {
        // If score is 90 or greater
        case gradeTotal >= 90:
            return "A";
            // If score is 80 or greater
        case gradeTotal >= 80:
            return "B";
            // If score is 70 or greater
        case gradeTotal >= 70:
            return "C";
            // If score is 60 or greater
        case gradeTotal >= 60:
            return "D";
            // Anything 59 or below is failing
        default:
            return "F";
    }
}

function getStudentGrade(studentNumber) {
    var sql3 = `SELECT * FROM Student_Grade WHERE studentID = '${studentNumber}'`;
    db.query(sql3, (err, data) => {
        if (err)
            return (err, null)
        else
            return data;
    });
}

function getCalculatedGrades(studentNumber, callback) {
    var sql = `SELECT * FROM Grade WHERE studentID='${studentNumber}'`;
    db.query(sql, (err, data, fields) => {
        if (err) {
            callback(err, null);
        } else {
            var gradeTotal = 0;
            var gradePercent = 0;
            var gradeScore = 0;
            var count = data.length;

            for (var i = 0; i < count; i++) {
                gradeScore = (data[i].gradeValue * data[i].gradePercent);
                gradePercent += data[i].gradePercent;
                gradeTotal += gradeScore;
            }
            gradeTotal /= gradePercent;

            gradeLetter = getGradeLetter(gradeTotal);

            var sql2 = `INSERT INTO Student_Grade (studentID, gradeAverage, gradeLetter) VALUES('${studentNumber}', '${gradeTotal}', '${gradeLetter}')`;
            db.query(sql2, (err, data) => {
                if (err)
                    callback(err, null)
                else {
                    console.log('Grades Successfully Submitted');
                }
            })
        }
    })
}

//Exports
module.exports = { getCalculatedGrades, getStudentNumber, getStudentGrade };