# GPT model chatbot

- presence_penalty,frequency_penalty
- persisting the conversation using firebase database
- Process: store instruction to chatbox in a conversation array; render user's input to DOM, place it in an object, store in conversation array; send conversation array to OpenAI API; get response, store in conversation array, render response to DOM, place it in an object, store in conversation array; repeat

# Quick start

```
$ npm install
$ npm start
```
