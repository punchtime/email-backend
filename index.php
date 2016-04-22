<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';

function send($to, $body, $subject) {
  $key = json_decode(file_get_contents('config.json'), true)['key'];
  $domain = json_decode(file_get_contents('config.json'), true)['domain'];
  $from = json_decode(file_get_contents('config.json'), true)['from'];

  $client = new \Http\Adapter\Guzzle6\Client();
  $mg = new \Mailgun\Mailgun($key, $client);

  $mg->sendMessage($domain, array(
    'from'    => $from.'@'.$domain,
    'to'      => $to,
    'subject' => $subject,
    'html'    => $body));

  return true;
}

$request = json_decode($HTTP_RAW_POST_DATA);

var_dump($request);

$employer = $request['company'];

// $employer = 'my-company-test';
var_dump($employer);
$code = 12;
$inviteEmail = <<<EOT
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
  </style>
</head>

<body>
  <p>Hey</p>
  <article>
    <p>Welcome to <a href="https://punchtime.io">punchtime</a>. Your employer ($employer) invited you to join his team.</p>
    <p>First download the app:</p>
    <p>
      <a href="https://play.google.com/"><img alt="install punchtime from the app store" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" /></a>
    </p>
    <p>Then you can add yourself to the team in settings and entering</p>
    <pre><code>$code</code></pre>
    <p>You can also click on this <a href="/Users/haroenv/Desktop/php" title="$code">link</a></p>
  </article>
  <p>Greetings!</p>
  <p>Punchtime Team</p>
  <p><a href="https://punchtime.io">punchtime.io</a></p>
</body>

</html>
EOT;
send('punchtimeio@gmail.com',$inviteEmail,'Welcome to punchtime!');
echo 'done with sending and stuff';
