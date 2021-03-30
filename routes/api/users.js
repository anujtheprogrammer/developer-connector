const express = require('express');
const router = express.Router();

// @router   get api/users
// @desc     test route
// @access   public
router.get('/', (req,res)=>{
    res.send('users router');
});

module.exports = router;