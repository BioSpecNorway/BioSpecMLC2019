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