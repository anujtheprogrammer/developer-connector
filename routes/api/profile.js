const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
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

// @router   post api/profile
// @desc     create or update user profile
// @access   private
router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills are required').not().isEmpty(),
] ], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if(company) profileFeilds.company = company;
    if(website) profileFeilds.website = website;
    if(location) profileFeilds.location = location;
    if(bio) profileFeilds.bio = bio;
    if(status) profileFeilds.status = status;
    if(githubusername) profileFeilds.githubusername = githubusername;
    if(skills){
        profileFeilds.skills = skills.split(',').map(skills => skills.trim());
    } 

    // build social object
    profileFeilds.social = {}
    if(youtube) profileFeilds.social.youtube = youtube;
    if(facebook) profileFeilds.social.facebook = facebook;
    if(twitter) profileFeilds.social.twitter = twitter;
    if(instagram) profileFeilds.social.instagram = instagram;
    if(linkedin) profileFeilds.social.linkedin = linkedin;

    try{
        let profile = await Profile.findOne({ user: req.user.id});

        if(profile){
            // update this profile if found
            Profile = await Profile.findByIdAndUpdate({ user: req.user.id}, {$set: profileFeilds}, {new:true});

            return res.json(profile);
        }

        // if profile not found create one
        profile = new Profile(profileFeilds);

        await profile.save();
        res.json(profile);

    } catch (err){
        console.error(err.message);
        res.status(500).send('server error');
    }

    console.log(profileFeilds.skills)
    res.send('hello');
});

// @router   get api/profile
// @desc     get all  profile
// @access   public
router.get('/', async (req,res)=>{
    try {
      const profiles = await Profile.find().populate('user', ['name','avatar']);
      res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @router   get api/profile/user/:user_id
// @desc     get profile by user id
// @access   public
router.get('/user/:user_id', async (req,res)=>{
    try {
      const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name','avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'profile not found'});
        }

      res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'profile not found'}); 
        }
        res.status(500).send('server error');
    }
});

// @router   delete api/profile
// @desc     delete profile user and post
// @access   private
router.delete('/',auth, async (req,res)=>{
    try {

    // remove profile
    await Profile.findOneAndRemove({ user:req.user.id });
    // remove user
    await User.findOneAndRemove({ _id:req.user.id });

    res.json({ msg: 'user deletd'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @router   put api/profile/experience
// @desc     add profile experience
// @access   private
router.put('/experience', [auth, [

    check('title','title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty(),

]] , async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(500).json({ errors : errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    }

    try {
       const profile = await Profile.findOne({ user: req.user.id});
        
       profile.experience.unshift(newExp);

       await profile.save();

       res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

// @router   Delete api/profile/experience/:exp_id
// @desc     delete experience from profile
// @access   private
router.delete('/experience/:exp_id', auth , async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id});

        // get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @router   put api/profile/education
// @desc     add profile education
// @access   private
router.put('/education', [auth, [

    check('school','school is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('feildofstudy','feildofstudy is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty(),

]] , async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(500).json({ errors : errors.array() });
    }

    const {
        school,
        degree,
        feildofstudy,
        from,
        to,
        current,
        description,
    } = req.body;

    const newEdu = {
        school,
        degree,
        feildofstudy,
        from,
        to,
        current,
        description,
    }

    try {
       const profile = await Profile.findOne({ user: req.user.id});
        
       profile.education.unshift(newEdu);

       await profile.save();

       res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

// @router   Delete api/profile/education/:edu_id
// @desc     delete education from profile
// @access   private
router.delete('/education/:edu_id', auth , async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id});

        // get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});




module.exports = router;