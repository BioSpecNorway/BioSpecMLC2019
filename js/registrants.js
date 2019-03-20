firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('main').style.display = 'block';

        showTable(); 
    }
    else {
        signIn();
    }
});

function showTable(){
    var docRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
    // check rights
    docRef.get().then(function(doc) {
        if (doc.exists && doc.data().can_read){
            addRegistrantsToTable();
        }
        else{
            setTextArea("Sorry, you don't have rights to see this information");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function addRegistrantsToTable() {
    var tbody = document.getElementById('table-body');
    firestore.collection('participants').get().then(function (querySnapshot) {
        var emails = '';
        for (i = 0; i < querySnapshot.docs.length; ++i){
            doc = querySnapshot.docs[i];
            tbody.appendChild(createRow(doc.data(), i + 1, false));
            emails += doc.data().email + ' ';
        }
        
        setTextArea(emails);
    });
}

function createRow(obj, index, accepted) {
    var row = document.createElement('tr');
    row.appendChild(createCell('td', index.toString()));
    row.appendChild(createBooleanCell('td', accepted));
    row.appendChild(createCell('td', obj.first_name));
    row.appendChild(createCell('td', obj.last_name));
    row.appendChild(createCell('td', obj.sex));
    
    row.appendChild(createCell('td', obj.email));
    row.appendChild(createCell('td', obj.telephone));
    
    row.appendChild(createCell('td', obj.organization));
    row.appendChild(createCell('td', obj.address));
    row.appendChild(createCell('td', obj.invoice_address));

    row.appendChild(createCell('td', obj.fee_type));
    row.appendChild(createCell('td', obj.fee));

    row.appendChild(createBooleanCell('td', obj.lunch_monday));
    row.appendChild(createBooleanCell('td', obj.lunch_tuesday));
    row.appendChild(createBooleanCell('td', obj.lunch_wednesday));
    row.appendChild(createBooleanCell('td', obj.lunch_vegetarian));

    row.appendChild(createBooleanCell('td', obj.dinner_tuesday));
    row.appendChild(createBooleanCell('td', obj.dinner_vegetarian));

    row.appendChild(createCell('td', obj.food_special));

    row.appendChild(createBooleanCell('td', obj.minsk_tour));
    return row;
}

function createCell(tag, text) {
    cell = document.createElement(tag);
    cell.appendChild(document.createTextNode(text));
    return cell;
}

function createIcon(icon_name, classes=''){
    var icon = document.createElement('i');

    icon.className = "material-icons " + classes;
    icon.appendChild(document.createTextNode(icon_name));

    return icon;
}

function createBooleanCell(tag, value) {
    var cell = document.createElement(tag);

    if (value){
        cell.appendChild(createIcon('done', 'teal-text'));
    }
    else{
        cell.appendChild(createIcon('clear'));
    }

    return cell;
}

function setTextArea(text){
    $('#emails-to-copy').val(text);
    M.textareaAutoResize($('#emails-to-copy'));
}

function signOut(){
    firebase.auth().signOut();

    // clear table
    var tbody = document.getElementById('table-body');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // hide table block
    document.getElementById('main').style.display = 'none';
}

function signIn(){
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInOptions: [{
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        }
        ],
    };

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}