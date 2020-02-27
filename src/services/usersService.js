
let models = require('../models');

function sortUsersByLetter(users,req,res){
    
        let letters = [];
        let persons = [];
        users.forEach(user => {
            if(req.user.id != user.id_user){ //current user cannot see him-self
                let letter = user.lastname.charAt(0).toUpperCase();
                let alreadyIn = letters.includes(letter); 
                if(!alreadyIn){
                    letters.push(letter);
                }
                var person = {
                    letter: letter,
                    id: user.id_user,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isAdmin: user.isAdmin 
                }
                persons.push(person);
            }
    });

    const results= {
        letters:letters,
        persons:persons
    }

    return results;
}

module.exports = {sortUsersByLetter};