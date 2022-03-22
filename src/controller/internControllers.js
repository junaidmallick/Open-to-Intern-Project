const internModel = require('../models/internModel')
const collegeModel = require("../models/collegeModel")
const mongoose = require('mongoose')


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0

}



const internEnrolled = async function (req, res) {
    try {

        const requestBody = req.body;

        //--------------------------------------------------------------------------------------bodyValidation
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Please provide intern details' })
            return
        }


        let { isDeleted, name, email, mobile, collegeName  } = requestBody; 

       //---------------------------------------------------------------------------------------nameValidation
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        
        //---------------------------------------------------------------------------------------mobileValidation
        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: `mobile no is required` })
            return
        }
        
        if (!(/^([+]\d{2})?\d{10}$/.test(requestBody.mobile))) {
            return res.status(400).send({ status: false, msg: "please provide a valid moblie Number" })
        }


        //---------------------------------------------------------------------------------------emailValidation
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Email is required' })
            return
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(requestBody.email))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }
        

        let duplicateEmail  = await internModel.findOne({email:requestBody.email})
        if(duplicateEmail){
            return res.status(400).send({ status:false, msg: 'email already exists'})
        }


        
        //----------------------------------------------------------------------------------------collegeValidation
        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, message: 'collegeName is required' })
            return
        }
        
        


        const college = await collegeModel.findOne({ name: collegeName, isDeleted: false });
        if (!college) {
            res.status(400).send({ status: false, message: 'college  does not exit or deleted' })
            return
        }

       let collegeId = college._id;
      
        const savedInternData = { name, email, mobile, collegeId, isDeleted }
        const createIntern = await internModel.create(savedInternData);
        res.status(201).send({ status: true, message: `intern is enrolled successfully`, data: createIntern })

    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.internEnrolled = internEnrolled;