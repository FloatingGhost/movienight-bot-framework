# Movienight Bot Framework

Subscribe to a Movienight Websocket and do things i guess

`npm i --save movienight-bot-framework`

```javascript
const Movienight = require('movienight-bot-framework');

const mn = new Movienight('ws://127.0.0.1:8089', 'myBotUsername');

mn.on('message', ({ from, msg }) => {
    console.log(`${from} says: ${msg}`);
});
```

## Events you can subscribe to

| event name      | structure        | fired on          |
| --------------- | --------------   | ----------------- |
| message         | `{ from, msg }`  | a new message     |
| server\_message | `msg`            | self-explanatory  |
| join            | `username`       | a user joins      |
| leave           | `username`       | a user leaves     |
| userlist        | `[user,user...]` | the list of users |
| ping            |                  |                   |
| connect         |                  | you join          |

