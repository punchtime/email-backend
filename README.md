# Email backend

> Note: this is a work in progress, and not yet a deployed backend.

The email backend is deployed on [uberspace](https://uberspace.de) and mostly hosts the addition of clients to employers. It's written in node.js. Use your own Mailgun key :smile:, you fill this in in your own `config.json`, just like `config.example.json`

## running it

### just the easy way

1. fill in `config.json`
2. `npm install`
3. `npm start` or `npm run-script start-old`
4. Have a drink :beer:

### perpetually

any way to keep a process alive will work. My perferred way is this:

```
$ nohup npm run-script start-old &
```

to stop you have to do `ps aux` and then find the PID of either `npm` or `node`. You can kill it with `kill -9 THEPID`.

## related

- [organisation](https://github.com/punchtime/organisation)
- [Android client](https://github.com/punchtime/android)
- [Web client](https://github.com/punchtime/web)

# License

Apache 2.0
