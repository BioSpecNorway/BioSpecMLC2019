document.getElementById('registration-form').addEventListener('submit', register);
function register(e) { 
    e.preventDefault();

    first_name = getInputValueById('registration-first-name');
    last_name = getInputValueById('registration-last-name');

    fee_type = document.querySelector('input[name="fees"]:checked').value;
    fee = 0;
    switch (fee_type){
        case 'student': fee = 60; break;
        case 'academic': fee = 100; break;
        case 'non-academic': fee = 150; break;
    }
    
    var participantObject = {
        sex: document.querySelector('input[name="sex"]:checked').value,
        first_name: first_name,
        last_name: last_name,

        email: getInputValueById('registration-email'),
        telephone: getInputValueById('registration-telephone'),

        organization: getInputValueById('registration-organization'),
        address: getInputValueById('registration-address'),
        invoice_address: getInputValueById('registration-invoice-address'),
        
        fee_type: fee_type,
        fee: fee,
        
        lunch_monday: getCheckedById('registration-lunch-mon'),
        lunch_tuesday: getCheckedById('registration-lunch-tue'),
        lunch_wednesday: getCheckedById('registration-lunch-wed'),
        lunch_vegetarian: getCheckedById('registration-lunch-veg'),
        
        dinner_tuesday: getCheckedById('registration-dinner-tue'),
        dinner_vegetarian: getCheckedById('registration-dinner-veg'),

        food_special: getInputValueById('registration-food-special'),
        
        minsk_tour: getCheckedById('registration-minsk-tour')
    };

    firestore.collection('participants').add(participantObject)
        .then(function(snapshot) {
            M.toast({html: 'Dear ' + first_name + ' ' + last_name + ', You are successfully registered!'});
            document.getElementById('registration-form').reset();
        }, function(error) {
            console.log('Registration error ' + error);
            M.toast({html: 'The error ' + error + ' happens. <br><br> Please, contact us by email biospec-workshop@nmbu.no'});
        });

    return false;
};


document.getElementById('subscribe-form').addEventListener('submit', subscribe);

function subscribe(e) {
    e.preventDefault();

    first_name = getInputValueById('subscribe-first-name');
    last_name = getInputValueById('subscribe-last-name');
    email = getInputValueById('subscribe-email');

    firestore.collection('subscribers').add({
        first_name: first_name,
        last_name: last_name,
        email: email
    }).then(
        function(snapshot) { 
            M.toast({html: 'Dear ' + first_name + ' ' + last_name + ', You are successfully subscribed!'});
            document.getElementById('subscribe-form').reset();
        }).catch(function(error) {
            console.log('Subscription error ' + error);
            M.toast({html: 'The error ' + error + ' happens. <br><br> Please, contact us by email biospec-workshop@nmbu.no'});
        });
    
    return false;
}

function getInputValueById(id){
    return document.getElementById(id).value;
}

function getCheckedById(id){
    return document.getElementById(id).checked;
}