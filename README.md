# GPT model chatbot

- use OpenAI createChatCompletion endpoint to generate response
- customize presence_penalty,frequency_penalty model parameters
- persisting the conversation using firebase database

## Notes

- presence_penalty:
  - Number from -2 to 2 in increments of 0.01. Defaults to 0.
  - At higher numbers it increases the model's likelihood of talking about new topics
- frequency_penalty:
  - Number from -2 to 2 in increments of 0.01. Defaults to 0.
  - At higher numbers it decreases the model's likelihood of repeating the same line verbatim
- about setting presence_penalty and frequency_penalty:don't go over 1 or under -1,make small change and test

## Process and data

- store instruction to chatbox in a conversation array; render user's input to DOM, place it in an object, store in conversation array; send conversation array to OpenAI API; get response, store in conversation array, render response to DOM, place it in an object, store in conversation array; repeat
- The instruction Object
  - Two key value pairs
  - first key: "role" and this should be corrresponding to the value "system"
  - second key: "content" and this should be corresponding to a string with an instruction for the chatbot
- The User input Object
  - Two key value pairs
  - first key: "role" and this should be corrresponding to the value "user"
  - second key: "content" and this should be corresponding to a string with the user's input
- The Object we send to OpenAI for chatcompletion

  - model and messages that hold conversations array

    ```python
    # Note: you need to be using OpenAI Python v0.27.0 for the code below to work
    import openai
    openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}
        ]
    )
    ```

# Quick start

```
$ npm install
$ npm start
```
