const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { post } = require('./profile');


// @router   POST api/posts
// @desc     CREATE POST
// @access   private
router.post('/', [ auth, [

    check('text','text is required').not().isEmpty(),

] ], async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text : req.body.text,
            name : user.name,
            avatar : user.avatar, 
            user : req.body.id
        }); 
        
        const post = await newPost.save();

        res.json(post);
    } catch (err) {
       console.error(err.message);
       res.status(500).send('server Error'); 
    }
});

// @router   GET api/posts
// @desc     Get all posts
// @access   private
router.get('/', auth ,async (req,res)=>{
    try {

        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);

    } catch (err) {

       console.error(err.message);
       res.status(500).send('server Error'); 

    }
});

// @router   GET api/posts/:id
// @desc     Get all posts for a id
// @access   private
router.get('/:id', auth ,async (req,res)=>{
    try {

        const posts = await Post.findById(req.params.id);

        if(!posts){
            return res.status(404).json({ msg:'post not found'});
        }

        res.json(posts);

    } catch (err) {

       console.error(err.message);
       if(!posts){
        return res.status(404).json({ msg:'post not found'});
        }
       res.status(500).send('server Error'); 

    }
});
/*
// @router   DELETE api/posts/:id
// @desc     delete post
// @access   private
router.delete('/:id', auth ,async (req,res)=>{
    try {

        const posts = await Post.findById(req.params.id);

        if(!posts){
            return res.status(404).json({ msg:'post not found'});
        }

        // check user
        if(posts.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'user not authorised'});
        }

        await posts.remove();

        res.json({ msg : 'Post removed'});

    } catch (err) {

       console.error(err.message);
       if(!posts){
        return res.status(404).json({ msg:'post not found'});
        }
       res.status(500).send('server Error'); 

    }
});
*/

module.exports = router;