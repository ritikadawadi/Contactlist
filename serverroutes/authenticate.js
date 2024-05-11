const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const hash = require('./bcrypt');
//const geo = require('node-geocoder');
//const geocoder = geo({ provider: 'openstreetmap'});


router.get('/signin', async (req, res) => {
    res.render('signin', { errors: [], hideLogin: true });
});

router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

router.post('/signin', async (req, res) => {
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByUsername(username);
    if (user && bcrypt.compareSync(p1, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('signin', { hideLogin: true, message: 'Could not authenticate' });
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
    const p2 = req.body.password_re.trim();

    if(firstname === '' || lastname === '', username==='', p1 ===''|| p2 ===''){
        res.render('signup', {hideLogin: true, message: 'Please fill out all fields'});
    }
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
});


module.exports = router;
