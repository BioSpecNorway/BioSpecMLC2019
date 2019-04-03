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

exports.sendRegisterEmail = functions.firestore.document('participants/{participantId}')
  .onCreate((snap, context) => {
    const subscriber = snap.data();

    notifyAboutNewParticipant(subscriber, 'biospec-workshop@nmbu.no');
    return confirmRegistration(subscriber);
  });

exports.sendSubscribeEmail = functions.firestore.document('subscribers/{subscriberId}')
  .onCreate((snap, context) => {
    const subscriber = snap.data();

    notifyAboutNewSubscriber(subscriber, 'biospec-workshop@nmbu.no');
    return confirmSubscription(subscriber);
  });

function notifyAboutNewParticipant(participant, receiver_email) {
  const mailOptions = {
    from: '"BioSpecMLC 2019" <noreply@firebase.com>',
    to: receiver_email,
  };

  // Building Email message.
  mailOptions.subject = 'Registration notification';
  mailOptions.text = 'New participant: ' + participant.first_name +
    ' ' + participant.last_name + ' ' + participant.email;

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Notification email sent to:', mailOptions.to);
  }).catch((error) => {
    return console.error('There was an error while sending the email:', error);
  });
}

function confirmRegistration(participant) {
  const mailOptions = {
    from: '"BioSpecMLC 2019" <noreply@firebase.com>',
    to: participant.email,
  };

  // Building Email message.
  mailOptions.subject = 'Registration confirmation';
  mailOptions.text = 'Dear ' + participant.first_name + ' ' + participant.last_name + ', \n\n' +
    `
    You are successfully registered at BioSpecMLC 2019 (https://biospecnorway.github.io/BioSpecMLC2019)! \n
    \n
    Your registration will be accepted after payment.\n
    \n
    PAYMENT METHOD \n
    -------------------------------------------------\n
    You can send abstract or poster to our email: biospec-workshop@nmbu.no \n
    Please, find this information at website https://biospecnorway.github.io/BioSpecMLC2019 \n
    \n
    You can contact us by email biospec-workshop@nmbu.no
    `;
  mailOptions.html = 'Dear ' + participant.first_name + ' ' + participant.last_name + ', <br><br>' +
    `You are successfully registered at <a href="https://biospecnorway.github.io/BioSpecMLC2019/" target="_blank">BioSpecMLC 2019</a>! <br>
    <br>
    Your registration will be accepted after payment.

    <h5> Payment Method </h5>

    Payments should be made by bank transfer at:

    <table>
      <tbody>
        <tr>
          <td> Name </td>
          <td>DNB Bank ASA </td>
        </tr>
        <tr>
          <td> Account owner </td>
          <td> Norwegian University of Life Sceinces </td>
        </tr>
        <tr>
          <td> Bank code </td>
          <td> DNB </td>
        </tr>
        <tr>
          <td> SWIFT code </td>
          <td> DNBANOKK </td>
        </tr>
        <tr>
          <td> Account number </td>
          <td> 76940512510 </td>
        </tr>
        <tr>
          <td> IBAN </td>
          <td> NO8976940512510 </td>
        </tr>
      </tbody>
    </table>

    <p style="color: red"> Note the payment with reference number: 1650026066 </p>
    <br>
    You can send <a href="https://biospecnorway.github.io/BioSpecMLC2019/#abstract" target="_blank"> abstract </a> or poster to our email: biospec-workshop@nmbu.no <br>
    For more information check <a href="https://biospecnorway.github.io/BioSpecMLC2019/" target="_blank">workshop website</a>. <br>
    For any questions you can contact us by email <b>biospec-workshop@nmbu.no</b>
    `;

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Registration confirmation sent to:', mailOptions.to);
  }).catch((error) => {
    return console.error('There was an error while sending the email:', error);
  });
}

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
