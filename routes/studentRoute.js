const express = require('express');
const router = express.Router();
const studentData = require('../model/studentModels');
const { verifyToken } = require('../lib/auth');
const ExitExam = require('../model/exitExamsModel')


router.get('/current', verifyToken, async (req, res) => {
  try {

    const email = req.authUser.email; //current logged in user email
    //const {email} = req.authUser;

    // Find the studentData document based on the student Id
    const student = await studentData.findOne({ "email": email });
    if (student)
      return res.json(student);

    throw new Error("User not found")

  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the studentData document based on the student Id
    const student = await studentData.findOne({ "_id": studentId });
    console.log(student);
    res.json(student);

  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/postData',  async (req, res) => {
  try {
    const data = req.body;
    const exitExam = new ExitExam(data);
    await exitExam.save();

    const student = await studentData.findOne({ "_id": data.studentId });
    student.set("status", true);
    await student.save();
    console.log(student);
    res.json('successfully uploaded');

  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;