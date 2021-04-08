const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {check,validationResult} = require('express-validator');
const User = require('../../models/Users');

const user = require('../../models/Users');

// @router   POST api/users
// @desc     register user
// @access   public
router.post('/', [

    check('name','enter a valid name').not().isEmpty(),
    check('email','please enter a valid email address').isEmail(),
    check('password','password should be min 6 character long').isLength({ min: 6 })

], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }

    const {name, email, password} = req.body;

    try{
        // user should not already exist
        let user = await User.findOne({ email });
        if(user){
            res.status(400).json({errors: [{msg: 'user already exist' }] });
        }

        // use avatar using gravatar
        const avatar = gravatar.url( email ,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        
        user = new User({
            name,
            email,
            avatar,
            password
        })

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();


        // return jsonwebtokens

        res.send('user registered');
    } catch (err){
        console.error(err.message);
        res.status(500).send('server error');
    }

    
});

module.exports = router;