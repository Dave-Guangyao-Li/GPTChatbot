# GPT model chatbot

- customize presence_penalty,frequency_penalty argument
- persisting the conversation using firebase database

## Process and data

- store instruction to chatbox in a conversation array; render user's input to DOM, place it in an object, store in conversation array; send conversation array to OpenAI API; get response, store in conversation array, render response to DOM, place it in an object, store in conversation array; repeat
- The instruction Object
  - Two key value pairs
  - first key: "role" and this should be corrresponding to the value "system"
  - second key: "content" and this should be corresponding to a string with an instruction for the chatbot

# Quick start

```
$ npm install
$ npm start
```
