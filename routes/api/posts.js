const express = require('express');
const router = express.Router();

// @router   get api/posts
// @desc     test route
// @access   public
router.get('/', (req,res)=>{
    res.send('posts router');
});

module.exports = router;