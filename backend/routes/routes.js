const express=require("express");
const router=express.Router();

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Employee=require("../models/employee");


// const verify = async(req,res,next)=>{
//     const cookie=req.cookies['jwt'];

//         const claims = jwt.verify(cookie,"secret");

//         if(!claims){
//             return res.status(401).send({
//                 message:"unauthenticated"
//             })
//         }
//         else{
//             next();
//         }
// }


router.post("/register", async (req, res) => {
    try {
        let { email, role, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const record = await Employee.findOne({ email: email });
        if (record) {
            return res.status(400).send({
                message: "Email is already registered"
            });
        }

        const user = new Employee({
            email: email,
            role: role,
            password: hashedPassword
        });
        const result = await user.save();

        const token = jwt.sign( { _id: user._id, email: user.email, role: user.role }, "secret-key",{ expiresIn: "1d" }                                            
        );


        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.send({
            message: "Registration successful",
            user: user,
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Server error"
        });
    }
});


router.post("/login",async (req,res)=>{
     const user=await Employee.findOne({email:req.body.email});
     if(!user){
        return res.status(404).send({
            message:"User not found"
        })
     }
     if(!(await bcrypt.compare(req.body.password,user.password))){
        return res.status(400).send({
            message:"Password is incorrect"
        })
     }

     const token=jwt.sign({ _id: user._id, email: user.email, role: user.role },"secret-key",{expiresIn:"1d"});
     res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:24*60*60*1000
     })
     console.log(token);
     res.send({
        role:user.role,
        id:user._id
     });
});
router.get("/employees",async(req,res)=>{
    let employees=await Employee.find({role:"Employee"});
    res.send({
        data:employees
    });
});
router.get("/employees/:id",async (req,res)=>{
    let {id}=req.params;
    let employee=await Employee.findById(id);
    console.log(employee);
    res.send({
        email:employee.email
    });
    
});





router.delete("/employees/:id", async (req,res)=>{
    let {id}=req.params;
    await Employee.findByIdAndDelete(id);
    res.send({
        message:"success"
    })
})
router.post("/logout",(req,res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.send({
        message:"success"
    })
})

module.exports=router;
