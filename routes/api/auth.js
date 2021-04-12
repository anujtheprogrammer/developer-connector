const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');
const User = require('../../models/Users')

// @router   get api/auth
// @desc     test route
// @access   public
router.get('/', auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch (err){
        console.err(err.message);
        res.status(500).send('server error');
    }
});

// @router   POST api/auth
// @desc     register user & get token
// @access   public
router.post('/', [

    check('email','please enter a valid email address').isEmail(),
    check('password','password should be min 6 character long').exists()

], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array() });
    }

    const { email, password} = req.body;

    try{
        // user should not already exist
        let user = await User.findOne({ email });
        if(!user){
            res.status(400).json({errors: [{msg: 'invalid credentials' }] });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            res.status(400).json({errors: [{msg: 'invalid credentials' }] }); 
        }
        
        // return jsonwebtokens
        const payload = {
            user: {
                id : user.id,
            }
        }

        jwt.sign(payload, 
            config.get('secretkey'), 
            {expiresIn : 3600000}, 
            (err ,token)=>{
                if(err) throw err;
                res.json({ token });
            });
    } catch (err){
        console.error(err.message);
        res.status(500).send('server error');
    }

});

module.exports = router;