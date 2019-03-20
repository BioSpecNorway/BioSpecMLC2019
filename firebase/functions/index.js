const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendSubscribeEmail = functions.firestore.document('subscribers/{subscriberId}')
  .onCreate((snap, context) => {
    const subscriber = snap.data();

    notifyAboutNewSubscriber(subscriber, 'biospec-workshop@nmbu.no');
    return confirmSubscription(subscriber);
  });

function notifyAboutNewSubscriber(subscriber, receiver_email) {
  const mailOptions = {
    from: '"BioSpecMLC 2019" <noreply@firebase.com>',
    to: receiver_email,
  };

  // Building Email message.
  mailOptions.subject = 'Subscription notification';
  mailOptions.text = 'New subcriber: ' + subscriber.first_name +
    ' ' + subscriber.last_name + ' ' + subscriber.email;

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Notification email sent to:', mailOptions.to);
  }).catch((error) => {
    return console.error('There was an error while sending the email:', error);
  });
}

function confirmSubscription(subscriber) {
  const mailOptions = {
    from: '"BioSpecMLC 2019" <noreply@firebase.com>',
    to: subscriber.email,
  };

  // Building Email message.
  mailOptions.subject = 'Subscription confirmation';
  mailOptions.text = 'Dear ' + subscriber.first_name + ' ' + subscriber.last_name + ', \n\n' +
  'Thank you for subscribing to BioSpecMLC 2019 (https://biospecnorway.github.io/BioSpecMLC2019)! \n\n' +
  'You can contact us by email biospec-workshop@nmbu.no';
  mailOptions.html = 'Dear ' + subscriber.first_name + ' ' + subscriber.last_name + ', <br><br>' +
    'Thank you for subscribing to <a href="https://biospecnorway.github.io/BioSpecMLC2019/" target="_blank">BioSpecMLC 2019</a>! <br><br>' +
    'You can contact us by email <b>biospec-workshop@nmbu.no</b>';

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Subscription confirmation sent to:', mailOptions.to);
  }).catch((error) => {
    return console.error('There was an error while sending the email:', error);
  });
}
