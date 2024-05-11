const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
//const hash = require('./bcrypt');
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap'});


router.get('/places', async (req, res) => {
    try {
        const contacts = await req.db.findContacts();
        const places = contacts.map(contact => ({
            id: contact.id,
            address: contact.address,
            latitude: contact.latitude,
            longitude: contact.longitude
        }));
        res.json(places);
    } catch (error) {
        console.error('Failed to get places:', error);
        res.status(500).json({ message: 'Failed to get places' });
    }
});




router.get('/', async (req, res) => {
    const contacts = await req.db.findContacts();
    res.render('home', {contacts: contacts});
});

router.post('/', async (req, res) => {
    res.render('home');
});

router.get('/create', async (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.redirect('/signin');
        return;
    }
    res.render('create', { hideLogin: false });
});

router.post('/create', async (req, res) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const address = req.body.address.trim();
    const contact_by_email = req.body.Contact_By_Email ? 1 : 0;
    const contact_by_phone = req.body.Contact_By_Phone ? 1 : 0;
    const contact_by_mail = req.body.Contact_By_Mail ? 1:0;

    if (firstname === '' || lastname === '' || email === ''|| address ===''){
        res.render('create', {message:'Please fill out the required fields', contact: req.body});
        return;
    }
    try {
    const geog = await geocoder.geocode(address);
    if (geog.length>0) {
        const latitude = geog[0].latitude;
        const longitude = geog[0].longitude;
        const address1 = geog[0].formattedAddress;
        const id = await req.db.createContact(firstname, lastname, phone, email, address1, contact_by_email, contact_by_phone, contact_by_mail, latitude, longitude);
        const contact = {
            id,
            firstname,
            lastname,
            phone,
            email,
            address,
            contact_by_email,
            contact_by_phone,
            contact_by_mail
        }
        res.redirect('/');}
        else {
            res.render('create', {message: 'Invalid Address', contact: req.body });
        }
    }
    catch(error) {

        console.error('Error creating contact: ', error);
        res.render('create', {message: 'Error occured while creating the contact.', contact: req.body})
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const contact = await req.db.findContactById(id);
    //check contact exists
    if(!contact){
        res.status(404).render('notfound');
        return;
    }
    res.render('contactinfo', { contact: contact });
});

router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.findContactById(id);
    console.log(req.session.user)
    if(req.session.user !== undefined){
        res.render('edit', { contact: contact });
        
    }else{
        res.status(401).render('authorized');
        return;
    } 
});

router.post('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const address = req.body.address.trim();
    const contact_by_email = req.body.Contact_By_Email ? 1 : 0;
    const contact_by_phone = req.body.Contact_By_Phone ? 1 : 0;
    const contact_by_mail = req.body.Contact_By_Mail ? 1: 0;
    //const contact = await req.db.findContactById(id);
    try {
    const geog = await geocoder.geocode(address);
    if(geog.length >0) {
        const latitude = geog[0].latitude;
        const longitude = geog[0].longitude;
        const address1 = geog[0].formattedAddress;
        await req.db.updateContact(id, firstname, lastname, phone, email, address1, contact_by_email, contact_by_phone, contact_by_mail, latitude, longitude);
        const contact = {
            id,
            firstname,
            lastname,
            phone,
            email,
            address,
            contact_by_email,
            contact_by_phone,
            contact_by_mail,
            latitude,
            longitude
        }
        res.redirect('/'+id);
    } else {
        res.render('edit', {message: 'Invalid Address', contact: {id, firstname, lastname, phone, email, address, contact_by_email, contact_by_phone, contact_by_mail}})
    }}
    catch(error){  

        console.error('Error updating contact', error);
        res.render('edit', {message: 'Error An error occcured while updating the contact', contact: req.body});
    }
});

router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.findContactById(id);
    if(req.session.user !== undefined){
            res.render('delete', { contact: contact });
    }
    else{
        res.status(401).render('authorized');
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
        res.status(401).render('authorized', { hideLogin: true, message: 'Please login to delete a contact' })
        return;
    }
});

module.exports = router;
