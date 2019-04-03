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
    let docRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
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

function compareDocs(a, b){
    if (a.first_name == b.first_name){
        return a.last_name.localeCompare(b.last_name);
    }
    return a.first_name.localeCompare(b.first_name);
}

function addRegistrantsToTable() {
    let tbody = document.getElementById('table-body');
    firestore.collection('participants').get().then((querySnapshot) => {
        let emails = '';
        let copy = querySnapshot.docs;
        copy.sort( (a, b) => compareDocs(a.data(), b.data()) );
        
        copy.forEach((doc, i) => {
            tbody.appendChild(createRow(doc.data(), i + 1, false));
            emails += doc.data().email + ' ';
        });
        
        setTextArea(emails);
    });
}

function createRow(obj, index, accepted) {
    let row = document.createElement('tr');
    row.appendChild(createCell('td', index.toString()));
    // row.appendChild(createBooleanCell('td', accepted));
    // row.appendChild(createCellNode('td', createIcon('warning', 'orange-text')));
    row.appendChild(createCell('td', obj.first_name));
    row.appendChild(createCell('td', obj.last_name));
    row.appendChild(createCell('td', obj.sex));

    // abstract
    if (typeof(obj.abstract) != 'undefined'){
        row.appendChild(createBooleanCell('td', obj.abstract));
    }
    else {
        row.appendChild(createCellNode('td', createIcon('warning', 'orange-text'), 'center'));
    }

    // poster
    if (typeof(obj.abstract) != 'undefined'){
        row.appendChild(createBooleanCell('td', obj.poster));
    }
    else{
        row.appendChild(createCellNode('td', createIcon('warning', 'orange-text'), 'center'));
    }
    
    row.appendChild(createCell('td', obj.email));
    row.appendChild(createCell('td', obj.telephone));
    
    row.appendChild(createCell('td', obj.organization, true));
    row.appendChild(createCell('td', obj.address, true));
    row.appendChild(createCell('td', obj.invoice_address, true));

    row.appendChild(createCell('td', obj.fee_type));
    row.appendChild(createCell('td', obj.fee));

    row.appendChild(createBooleanCell('td', obj.lunch_monday));
    row.appendChild(createBooleanCell('td', obj.lunch_tuesday));
    row.appendChild(createBooleanCell('td', obj.lunch_wednesday));
    row.appendChild(createBooleanCell('td', obj.lunch_vegetarian));

    row.appendChild(createBooleanCell('td', obj.dinner_tuesday));
    row.appendChild(createBooleanCell('td', obj.dinner_vegetarian));

    row.appendChild(createCell('td', obj.food_special, true));

    row.appendChild(createBooleanCell('td', obj.minsk_tour));
    return row;
}

function createCell(tag, text, long_text) {
    let cell = document.createElement(tag);
    cell.appendChild(document.createTextNode(text));
    if (long_text){
        cell.className = 'normalWrap'
    }
    return cell;
}

function createCellNode(tag, node, classes=''){
    let cell = document.createElement(tag);
    cell.appendChild(node);
    cell.className = classes;
    return cell;
}

function createIcon(icon_name, classes=''){
    let icon = document.createElement('i');

    icon.className = "material-icons " + classes;
    icon.appendChild(document.createTextNode(icon_name));

    return icon;
}

function createBooleanCell(tag, value) {
    let cell = document.createElement(tag);

    if (value){
        cell.appendChild(createIcon('done', 'teal-text'));
    }
    else{
        cell.appendChild(createIcon('clear'));
    }

    cell.className = 'center';
    return cell;
}

function setTextArea(text){
    $('#emails-to-copy').val(text);
    M.textareaAutoResize($('#emails-to-copy'));
}

function signOut(){
    firebase.auth().signOut();

    // clear table
    let tbody = document.getElementById('table-body');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // hide table block
    document.getElementById('main').style.display = 'none';
}

function signIn(){
    // Initialize the FirebaseUI Widget using Firebase.
    let ui = new firebaseui.auth.AuthUI(firebase.auth());

    let uiConfig = {
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