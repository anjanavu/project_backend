const express = require('express');
const router = express.Router();
const studentData = require('../model/studentModels')
const batchData = require('../model/batchModel')
const nodemailer = require('nodemailer');
const { verifyToken } = require('../lib/auth');
const examData=require('../model/exitExamsModel')
require('dotenv').config();

router.get('/student',verifyToken, async (req, res) => {
    try {
      const data = await studentData.find();
       res.json(data);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
      res.status(404).json(error);
    }
});

router.get('/batch', verifyToken, async (req, res) => {
  try {
    const data = await batchData.find();
    res.json(data);
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    res.status(404).json(error);
  }
});
//---------Get Batch By Id------------
router.get('/batch/:batchId',verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;

    const students = await examData.find({ batchId })
      .populate('studentId', ['name', 'email', 'exitTestConfirmation', 'status']);

    if (req.accepts("text/csv")) {
      const csvData = students.map((student) => [student._id, student.studentId.name, student.studentId.email, student.result]);
      csvData.unshift(["Id", "Name", "Email", "Result"]);

      res.header('Content-Type', 'text/csv');
      res.send(csvData.join("\n"));
    } else {
      res.json(students);
    }
  } catch (error) {
    console.error("Error occurred while fetching students:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const { Types } = require('mongoose');

router.post('/upload-result/:batchId', verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { csvFile } = req.files; 

    const students = await examData.find({ batchId }).populate('studentId');
    const csvData = csvFile.data.toString('utf8');
    const lines = csvData.split('\n');

    for (const line of lines.slice(1)) { 
      const [studentId, name, email, result] = line.split(',');

      const student = students.find((s) => s.studentId.email === email.trim());

      if (student) {
        student.result = parseInt(result, 10);
        await student.save();
      } else {
        console.error(`Student with email ${email} not found`);
      }
    }

    res.send('Results uploaded successfully');
  } catch (error) {
    console.error('Error uploading results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//------Send Email-----------
router.post('/send-emails', verifyToken, async (req, res) => {
  try {
    const { batchDetails } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    for (const student of batchDetails) {
      const { studentId, result } = student
        const mailOptions = {
          from:process.env.EMAIL_USER ,
          to: student.studentId.email,
          subject: 'Exam Results',
        text: `Dear ${studentId.name},\n\nYour exam result is: ${result || '-'}`,
       };

       
        await transporter.sendMail(mailOptions);
      
    }

    res.send( 'Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;