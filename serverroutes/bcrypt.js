const bcrypt = require('bcryptjs');

const hash = (password) =>
{
    const salt = bcrypt.genSaltSync(10); // generates salt for hashing 
    const hash = bcrypt.hashSync(password, salt); // hashes the password 
    return hash;
}

module.exports = hash;





// require seraches the node_modules for that specfic thing 
// .export exports the hashed password so that it is used instead of the original in codebase, and that is saved in db too
// the 10 is the const factor, so is higher more algorim so safer 