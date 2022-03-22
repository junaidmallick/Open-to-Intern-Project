const express = require('express')
const collegeController = require('../controller/collegeController')
const internController = require('../controller/internControllers')

const router = express.Router()

router.post('/functionup/colleges', collegeController.createCollege)
router.post('/functionup/interns', internController.internEnrolled)
router.get('/functionup/collegeDetails',collegeController.internList)




module.exports = router








