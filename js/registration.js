function register() { 
    var participantObject = {
        first_name: "a",
        last_name: "b",
        sex: "Female",
        email: "kek",
        telephone: "mom",
        organization: "asd",
        address: "address",
        invoice_address: "invoice",
        fee: 30,
        lunch_monday: true,
        lunch_tuesday: true,
        lunch_wednesday: true,
        lunch_vegan: true,
        dinner_tuesday: true,
        dinner_vegan: true,
        minsk_tour: true

    };

    console.log('ekk');
    firestore.collection('participants').add(participantObject)
        .then(function(snapshot) {
            console.log('success');
        }, function(error) {
            console.log('error' + error);
            // error(); // some error method
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
            console.log('Subscription error ' + error)
            M.toast({html: 'The error ' + error + ' happens. <br><br> Please, contact us by email biospec-workshop@nmbu.no'});
        });
    
    return false;
}

function getInputValueById(id){
    return document.getElementById(id).value;
}