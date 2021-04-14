const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');

// @router   get api/profile/me
// @desc     get current user profile
// @access   private
router.get('/me',auth, async (req,res)=>{
    try{
        const profile = await Profile.findOne({ user : req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            res.status(400).json({ msg : 'No user found with this profile'});
        }

        res.json(profile);
    } catch(err){
        console.error(err.message)
        res.status(500).send('server error');
    }
});

module.exports = router;