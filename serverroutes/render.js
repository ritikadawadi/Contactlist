const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const contacts = await req.db.findContacts();
    res.render('home', {contacts: contacts});
});

router.post('/', async (req, res) => {
    res.render('home');
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
    const contact_by_email = req.body.Contact_By_Email ? 1 : 0;
    const contact_by_phone = req.body.Contact_By_Phone ? 1 : 0;

        const id = await req.db.createContact(firstname, lastname, phone, email, street, city, state, zip, country, contact_by_email, contact_by_phone);
        res.redirect('/');
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
    const contact_by_email = req.body.Contact_By_Email ? 1 : 0;
    const contact_by_phone = req.body.Contact_By_Phone ? 1 : 0;
    const contact = await req.db.findContactById(id);
    console.log(req.session.user)
    if(req.session.user !== undefined){
            const _id = await req.db.updateContact(id, firstname, lastname, phone, email, street, city, state, zip, country, contact_by_email, contact_by_phone);
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
