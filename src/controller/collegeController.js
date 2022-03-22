const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')


const isValid = function (value){
    if (typeof value == 'undefined' || value == null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody){
     return Object.keys(requestBody).length > 0
}

const createCollege = async function(req,res){
    try{

        //---------------------------------------------------------------------------------------requestBodyValidation
        const requestBody = req.body;
        if(!isValidRequestBody(requestBody)){
            res.status(400).send({ status: false, msg: 'Please provide college details'})
            return
        }
        let { name , fullName , logoLink , isDeleted } = requestBody; 


        //---------------------------------------------------------------------------------------nameValidation
        if (!isValid(name)){
            res.status(400).send({ status:false, msg: 'name is required'})
            return
        }
        
        //---------------------------------------------------------------------------------------fullNameValidation
        if (!isValid(fullName)){
            res.status(400).send({ status:false, msg: 'fullName is required'})
            return
        }
        

        //---------------------------------------------------------------------------------------logoLinkValidation
        if(!isValid(logoLink)){
            res.status(400).send({ status:false, msg: 'logoLink is required'})
            return
        }

        if((/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/.test(requestBody.logoLink))){


        //---------------------------------------------------------------------------------------uniqueNameValidation
        let duplicate  = await collegeModel.findOne({name:requestBody.name})
        if(duplicate){
            return res.status(400).send({ status:false, msg: 'name already exists'})
        }


        const Data = { name, fullName, logoLink, isDeleted }
        let savedData = await collegeModel.create(Data)

        console.log(savedData)     // for checking what all prints comes in savedData

        res.status(201).send({ status:true, data:savedData })
    }
    else return res.status(400).send({ status:false, msg: 'Not a valid logoLink'})
    }

    catch(err){
        res.status(500).send({ status:false, msg:err })

        console.log(err)
    }
}




const internList = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;
        
        if (!collegeName) {
           return res.status(400).send({ status: false, msg: 'CollegeName required' })
        }

        let collegeDetail = await collegeModel.findOne({ name: collegeName , isDeleted: false })

        if (!collegeDetail)
             {
            return res.status(400).send({ status: false, msg: 'college name not in the dataBase' })
        }

       // console.log(collegeDetail._id)

        let internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        //console.log(internDetail)
        

        let result = {
            name: collegeDetail.name,
            FullName: collegeDetail.fullName,
            LogoLink: collegeDetail.logoLink,
            intern: internDetail
        }
         
        if (internDetail.length === 0) {
            return res.status(201).send({ status: true, result, msg: 'intern Details not present' })
        }else{
            res.status(200).send({status: true, data: result})
        }

        
    } 
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.createCollege = createCollege;
module.exports.internList = internList;