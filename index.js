'use strict';
const config = require('./config.json');
const mailgun = require('mailgun-js')({apiKey: config.key, domain: config.domain});
const Firebase = require('firebase');
const base = new Firebase('https://scorching-inferno-1467.firebaseio.com/');

try {

base.authWithPassword({
  "email": config.login.email,
  "password": config.login.password
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    base.child('invites').on('child_added',snap=>{
      if (snap.val().sent != true) {
        let code = snap.key();
        let employer = snap.val().company.name;
        let emailTemp = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, Roboto, sans-serif;">
  <p>Hey</p>
  <div style="margin: 2em 0;">
    <p>Welcome to <a href="https://punchtime.io">punchtime</a>. Your employer (${employer}) invited you to join their team.</p>
    <p>First download the app:</p>
    <p>
      <a href="https://play.google.com/store/apps/details?id=io.punchtime.punchtime"><img height="50px" alt="install punchtime from the app store" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"></a>
    </p>
    <p>Then you can add yourself to the team in settings and entering</p>
    <pre><code style="font-family: Menlo, monospace;background-color: lightgrey;margin: 1em;padding: .3em;">${code}</code></pre>
    <p>You can also click on this <a href="https://punchtime.io/invite/#${code}" title="${code}">link</a> on your phone.</p>
    <p><a href="https://punchtime.io/invite/#${code}">https://punchtime.io/invite/#${code}</a></p>
  </div>
  <p>Greetings!</p>
  <p>Punchtime Team</p>
  <p><a href="https://punchtime.io">punchtime.io</a></p>
  <p style="font-size: .8em;color: grey;font-style: italic;margin: 1em;text-align: center;border-top: 1px solid grey;">If you didn't expect this email, you can safely ignore it.</p>
</body>
</html>`;

        mailgun.messages().send({
          from: 'Punchtime Invitation<'+config.from+'@'+config.domain+'>',
          to: snap.val().email,
          subject: 'You were invited to punchtime!',
          html: emailTemp
        }, function (error, body) {
          console.log(body);
        });

        base.child('invites')
            .child(snap.key())
            .child('sent')
            .set(true);
      }
    });

    base.child('invites').on('child_changed',snap=>{
      console.log(snap.val().claimed);
      if (snap.val().claimed === 'true' || snap.val().claimed === true) {
        base.child('users')
            .child(snap.val().user)
            .child('employee')
            .child(snap.val().company.id)
            .set(true);
        base.child('companies')
            .child(snap.val().company.id)
            .child('employees')
            .child(snap.val().user)
            .set(true);
        console.log(`${snap.key()} has been claimed by ${snap.val().user}!`);
      }
    });
  }
});

} catch(e) {
  mailgun.messages().send({
    from: 'Punchtime Invitation<'+config.from+'@'+config.domain+'>',
    to: 'Haroen Viaene <hello@haroen.me>',
    subject: 'An error in the email occurred',
    text: e
  }, function (error, body) {
    console.log(body);
  });
}
