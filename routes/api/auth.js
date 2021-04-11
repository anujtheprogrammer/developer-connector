const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

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

module.exports = router;