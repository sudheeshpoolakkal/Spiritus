import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'


// API to register user
const registerUser = async (req,res)=>{
    try{

        const { name, email, password } = req.body

        if ( !name || !password || !email ){
            return res.json({success:false,message:"Missing Dtails..."})
        }

        // Validating Email Format
        if ( !validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email..."})
        }

        // Validating Strong Password
        if (password.length < 8 ){
            return res.json({success:false,message:"Enter a Strong Password..."})
        }


        // Hashing User Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email, 
            password : hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()


        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET )

        res.json({success:true, token})


    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for user Login
const loginUser = async (req,res) => {
    try{

        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if (!user){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }

        else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    }
    catch (error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to Book Appointment
const bookAppointment = async (req,res) =>{
    
    try{

        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available){
            return res.json({success:false,message:'Doctor not Available'})
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if (slots_booked[slotDate]){
            if (slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot not Available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        } else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots Data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Booked'})

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

export { registerUser, loginUser, bookAppointment }