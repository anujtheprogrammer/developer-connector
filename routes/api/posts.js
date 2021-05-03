
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { post } = require('request');


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
            user : req.user.id
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


// @route   DELETE api/posts/:id
// @desc    DELETE A POST
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        // check user
        if(String(post.user) !== req.user.id){
            console.log(post.user)
            console.log(req.user.id)
            return res.status(401).json({msg: 'User not authorized'});
        }

        await post.remove();
        res.json({msg: 'Post removed'});
    } catch (err) {
        console.error(err.message);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        res.status(500).send('server error');
    }
});


// @router   PUT api/posts/like/:id
// @desc     like a post
// @access   private
router.put('/like/:id', auth ,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        // check this post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'post already liked'});
        }

        post.likes.unshift({ user: req.user.id});

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server Error');  
    }
});

// @router   PUT api/posts/unlike/:id
// @desc     like a post
// @access   private
router.put('/unlike/:id', auth ,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        // check this post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'post is not yet liked'});
        }

        // get reomve index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server Error');  
    }
});

// @router   POST api/posts/comment/:id
// @desc     comment on a post
// @access   private
router.post('/comment/:id', [ auth, [

    check('text','text is required').not().isEmpty(),

] ], async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar, 
            user : req.user.id
        }; 

        post.comments.unshift(newComment);
        
        post.save();

        res.json(post.comments);
    } catch (err) {
       console.error(err.message);
       res.status(500).send('server Error'); 
    }
});

// @router   DELETE api/posts/comment/:id/:comment_id
// @desc     delete post
// @access   private
router.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        
        // pull out comment
        const comment = post.comments.find( comment => comment.id === req.params.comment_id);
        
        if(!comment){
            return res.status(404).json({ msg : 'comment does not exist'});
        }

        // check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'user not authorized'});
        }

        // get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex,1);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
       res.status(500).send('server Error'); 
    }
});


module.exports = router;
