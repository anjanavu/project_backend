const express = require('express');
const router = express.Router();
const Student = require('../model/studentModels');
const { getSignedToken } = require('../lib/auth');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let token = null;

        if (email === 'admin@gmail.com' && password === 'admin') {
            // Check hardcoded admin credentials
            let payload = { email: email, password: password };
            token = getSignedToken(payload);
        } else {
            const foundUser = await Student.findOne({ email, password });

            if (foundUser) {
                if (foundUser.exitTestConfirmation) {
                    let payload = { email: email, password: password };
                    token = getSignedToken(payload);
                } else {
                    return res.status(401).send('You are not eligible for the exam!');
                }
            } else {
                // No matching credentials
                return res.status(401).send('Invalid credentials, please try again!');
            }
        }

        res.status(200).send({ message: 'success', token: token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send(error);
    }
});





module.exports = router;