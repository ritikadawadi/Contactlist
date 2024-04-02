const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>
{
    const contacts = await req.db.findContacts();
    res.render('home', {contacts: contacts});
});
router.post('/', async(req, res)=>
{
    res.render('home');
})

module.exports = router;









// uses get and post, like pug 
// router is a middleware
// get renders pug after searching the contact, so that it displays the contact
