'use strict';
const config = require('./config.json');
const mailgun = require('mailgun-js')({apiKey: config.key, domain: config.domain});
const Firebase = require('firebase');
const base = new Firebase('https://scorching-inferno-1467.firebaseio.com/');
let employer = 'k', code = 'x';

base.child('invites').on('child_added',snap=>{
  console.log(snap.val());
  if (snap.val().sent != true) {
    let code = snap.key();
    let employer = snap.val().company.name;
    let emailTemp = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
      body {
        font-family: -apple-system, Roboto, sans-serif;
      }
      img {
        width: 10em;
      }
      code {
        font-family: Menlo, monospace;
        background-color: lightgrey;
        margin: 1em;
        padding: .3em;
      }
      article {
        margin: 2em 0;
      }
      .muted {
        font-size: .8em;
        color: grey;
        font-style: italic;
        margin: 1em;
        text-align: center;
        border-top: 1px solid grey;
      }
      </style>
    </head>
    <body>
      <p>Hey</p>
      <article>
        <p>Welcome to <a href="https://punchtime.io">punchtime</a>. Your employer (${employer}) invited you to join his team.</p>
        <p>First download the app:</p>
        <p>
          <a href="https://play.google.com/"><img alt="install punchtime from the app store" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" /></a>
        </p>
        <p>Then you can add yourself to the team in settings and entering</p>
        <pre><code>${code}</code></pre>
        <p>You can also click on this <a href="punchtime://${code}" title="${code}">link</a></p>
      </article>
      <p>Greetings!</p>
      <p>Punchtime Team</p>
      <p><a href="https://punchtime.io">punchtime.io</a></p>
      <p class="muted">If you didn't expect this email, you can safely ignore it.</p>
    </body>
    </html>
    `;

    mailgun.messages().send({
      from: 'Punchtime Invitation<'+config.from+'@'+config.domain+'>',
      to: snap.val().email,
      subject: 'You were invited to punchtime!',
      html: emailTemp
    }, function (error, body) {
      console.log(body);
    });

    base.child('invites').child(snap.key()).child('sent').set(true);
  }
});
