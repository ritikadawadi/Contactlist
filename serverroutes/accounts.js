const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const hash = require('./bcrypt');

router.get('/login', async (req, res) => {
    res.render('login', { hideLogin: true });
});

router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

router.post('/login', async (req, res) => {
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByUsername(username);
    if (user && bcrypt.compareSync(p1, user.password)) {
        req.session.user = user;
        res.redirect('/');
        return;
    } else {
        res.render('login', { hideLogin: true, message: 'Could not authenticate' });
        return;
    }
});

router.get('/signup', async (req, res) => {
    res.render('signup', { hideLogin: true });
});

router.post('/signup', async (req, res) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    if (p1 != p2) {
        res.render('signup', { hideLogin: true, message: 'Passwords do not match!' });
        return;
    }

    const user = await req.db.findUserByUsername(username);
    if (user) {
        res.render('signup', { hideLogin: true, message: 'This account already exists!' });
        return;
    }

    const id = await req.db.createUser(firstname,lastname,username, hash(p1));
    req.session.user = await req.db.findUserById(id);
    res.redirect('/');
    // res.render('signup', { hide_login: true });
});


router.get('/create', async (req, res) => {
    res.render('create', { hideLogin: true });
});

router.post('/create', async (req, res) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();
    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim();
    const country = req.body.country.trim();
    const contact_by_email = req.body.Contact_by_email ? 1 : 0;
    const contact_by_phone = req.body.Contact_by_phone ? 1 : 0;
    const contact_by_mail = req.body.contact_by_mail ? 1 : 0;
    
    // if(req.session.user !== undefined){
        const id = await req.db.createContact(firstname, lastname, phone, email, street, city, state, zip, country, contact_by_email, contact_by_phone, contact_by_mail);
        res.redirect('/');
        

    // }else{
    //     res.render('login', { hide_login: true, message: 'Please login to create a contact' });
    //     return;
    // }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const contact = await req.db.findContactById(id);
    //check contact exists
    if(!contact){
        res.render('notfound');
        return;
    }
    res.render('contactinfo', { contact: contact });
});

router.get('/:id', async (req, res) => {
    res.render('contactinfo', { hideLogin: true });
});

router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.findContactById(id);
    console.log(req.session.user)
    if(req.session.user !== undefined){
        res.render('edit', { contact: contact });
        
    }else{
        res.render('authorized');
        return;
    }
});

router.post('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();

    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim();
    const country = req.body.country.trim();
    const contact_by_email = req.body.contact_by_email ? 1 : 0;
    const contact_by_phone = req.body.contact_by_phone ? 1 : 0;
    const contact_by_mail = req.body.contact_by_mail ? 1 : 0;
    const contact = await req.db.findContactById(id);
    console.log(req.session.user)
    if(req.session.user !== undefined){
            const _id = await req.db.updateContact(id, firstname, lastname, phone, email, street, city, state, zip, country, contact_by_email, contact_by_phone, contact_by_mail);
            res.redirect('/'+id);
        }
    else{
        res.render('authorized');
        return;
    }
});

router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.findContactById(id);
    if(req.session.user !== undefined){
            res.render('delete', { contact: contact });
    }
    else{
        res.render('authorized');
        return;
    }
});

router.post('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.findContactById(id);

    console.log(contact)
    if(req.session.user !== undefined){
            const _id = await req.db.deleteContact(id);
            console.log(_id)
            res.redirect('/');
            return;
    }else{
        res.render('authorized', { hideLogin: true, message: 'Please login to delete a contact' })
        return;
    }
});

module.exports = router;