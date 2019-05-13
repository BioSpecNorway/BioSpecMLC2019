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

summary_info = {
    'student': 0,
    'academic': 0,
    'non-academic': 0,
    'covered': 0,
    'total': 0,
    'total-money': 0,
    'abstracts': 0,
    'posters': 0,
    'lunch-mon': 0,
    'lunch-tue': 0,
    'lunch-wed': 0,
    'lunch-veg': 0,
    'dinner-tue': 0,
    'dinner-veg': 0,
    'minsk-tour': 0,
};

var participants_list = [];

function updateSummaryInfo(doc){
    summary_info[doc.fee_type]++;
    summary_info['total-money'] += doc.fee;
    summary_info['total']++;
    if (doc.abstract) summary_info['abstracts']++;
    if (doc.poster) summary_info['posters']++;
    summary_info['lunch-mon'] += doc.lunch_monday;
    summary_info['lunch-tue'] += doc.lunch_tuesday;
    summary_info['lunch-wed'] += doc.lunch_wednesday;
    summary_info['lunch-veg'] += doc.lunch_vegetarian;
    summary_info['dinner-tue'] += doc.dinner_tuesday;
    summary_info['dinner-veg'] += doc.dinner_vegetarian;
    summary_info['minsk-tour'] += doc.minsk_tour;
}

function showSummaryInfo(){
    for (let key in summary_info){
        let cell = document.getElementById('summary-' + key);
        cell.appendChild(document.createTextNode(summary_info[key]));
    }
}

/*
 *  This function MUST BE consistent with createRow :(
 */
function gatherPariticipantInfo(obj, index){
    let info = [];
    info.push(index);
    info.push(obj.first_name);
    info.push(obj.last_name);
    info.push(obj.sex);

    // abstract
    if (typeof(obj.abstract) != 'undefined'){
        info.push(obj.abstract);
    }
    else {
        info.push('n/a');
    }

    // poster
    if (typeof(obj.abstract) != 'undefined'){
        info.push(obj.poster);
    }
    else{
        info.push('n/a');
    }
    
    info.push(obj.email);
    info.push(obj.telephone);
    
    info.push(obj.organization);
    info.push(obj.address);
    info.push(obj.invoice_address);

    info.push(obj.fee_type);
    info.push(obj.fee);

    info.push(obj.lunch_monday);
    info.push(obj.lunch_tuesday);
    info.push(obj.lunch_wednesday);
    info.push(obj.lunch_vegetarian);

    info.push(obj.dinner_tuesday);
    info.push(obj.dinner_vegetarian);

    info.push(obj.food_special);

    info.push(obj.minsk_tour);
    return info;
}

function addRegistrantsToTable() {
    let tbody = document.getElementById('table-body');
    firestore.collection('participants').get().then((querySnapshot) => {
        let emails = '';
        let copy = querySnapshot.docs;
        copy.sort( (a, b) => compareDocs(a.data(), b.data()) );
        
        copy.forEach((doc, i) => {
            updateSummaryInfo(doc.data());
            participants_list.push(gatherPariticipantInfo(doc.data(), i + 1));
            tbody.appendChild(createRow(doc.data(), i + 1, false));
            emails += doc.data().first_name + ' ' + doc.data().last_name + 
                      ' <' + doc.data().email + '>;\n';
        });
        
        showSummaryInfo();
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

function download() {
    filename = 'participants_table.csv';
    header = '#;First Name;Last Name;Sex;Abstract;Poster;E-mail;Telephone;Organization;Address;Invoice Address;Fee Type;Fee;Lunch Mon;Tue;We;Vegetarian;Dinner Tue;Vegetarian;Food Special;Minsk Tour';
    separator = '$3E@#$AT0R';
    text = '';
    for (let i = 0; i < participants_list.length; ++i){
        let info = participants_list[i];
        text += info.join(separator) + '\n';
    }
    text = header + '\n' + text.split(';').join(',').split(separator).join(';');

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
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