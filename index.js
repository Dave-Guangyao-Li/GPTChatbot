import { Configuration, OpenAIApi } from 'openai'
import { process } from './env'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, remove } from "firebase/database";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

delete configuration.baseOptions.headers['User-Agent'];

const openai = new OpenAIApi(configuration)


const firebaseConfig = {
    databaseURL: process.env.DATABASE_URL
}
const app = initializeApp(firebaseConfig) // initialize firebase app, with the database URL from env.js
const database = getDatabase(app)
const conversationInDb = ref(database) // reference to the database, which is a JSON object, ref() is a function that takes in a database URL and returns a reference to the database



const instructionObj = { // sent this instruction object to API every time a new conversation is started
    role: "system",
    // content: "You are a highly knowledgeable assistant that is always happy to help."
    // content:"You are an assistant that gives very short answers".
    content: "You are a highly sarcastic assistant."
} // stores the conversation history, content can change chatbot's personality

const chatbotConversation = document.getElementById('chatbot-conversation')

document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')
    // conversationArr.push({
    //     role: "user",
    //     content: userInput.value
    // })// Push an object holding the user's input to conversationArr.

    push(conversationInDb, { // push the user's input to the database
        role: "user",
        content: userInput.value
    })

    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight  // move dialogue to bottom of chatbot conversation ,so that it is always visible
})


// Create a function called renderConversationFromDb which will render any existing conversation in the database. This function should be called when the app loads.
function renderConversationFromDb() {
    get(conversationInDb).then((snapshot) => {
        if (snapshot.exists()) {
            const conversationArr = Object.values(snapshot.val())
            conversationArr.forEach((dbobj) => {
                const newSpeechBubble = document.createElement('div')
                newSpeechBubble.classList.add(
                    'speech', `speech-${dbobj.role === 'user' ? 'human' : 'ai'}`)
                chatbotConversation.appendChild(newSpeechBubble)
                newSpeechBubble.textContent = dbobj.content // textcontent is secure and faster than innerHTML, since it does not parse HTML, it can prevent XSS attacks
                chatbotConversation.scrollTop = chatbotConversation.scrollHeight // move dialogue to bottom of chatbot conversation ,so that it is always visible
            })
        }
        else {
            console.log('No data available')
        }
    })
}



// fetchReply()
function fetchReply() {
    get(conversationInDb).then(async (snapshot) => {
        if (snapshot.exists()) {
            // console.log(Object.values(snapshot.val()))
            const conversationArr = Object.values(snapshot.val())
            conversationArr.unshift(instructionObj)
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversationArr,
                presence_penalty: 0,
                frequency_penalty: 0.3
            })
            console.log(response)
            // conversationArr.push(response.data.choices[0].message)
            // add the chatbot's completion response to the database
            push(conversationInDb, response.data.choices[0].message)
            renderTypewriterText(response.data.choices[0].message.content)
        }
        else {
            console.log('No data available')
        }

    })

}

// render a blinking cursor to indicate that the chatbot is typing, then render the chatbot's response. By repeatedly adding characters to the speech bubble element with a slight delay, the text appears as if it is being typed out, and the added 'blinking-cursor' class creates a blinking effect.
function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div') // create a new speech bubble element, 
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble) // add the speech bubble to the chatbot conversation, appendChild adds the element to the end of the parent element
    let i = 0
    const interval = setInterval(() => { // add characters to speech bubble with a slight delay between each character
        newSpeechBubble.textContent += text.slice(i - 1, i)
        if (text.length === i) {
            clearInterval(interval) // stop adding characters to speech bubble when the end of the text is reached
            newSpeechBubble.classList.remove('blinking-cursor') // remove blinking cursor
        }
        i++ // increment i to add next character
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight // move dialogue to bottom of chatbot conversation ,so that it is always visible
    }, 50)
}


// use remove method to remove 
document.getElementById('clear-btn').addEventListener('click', () => {
    remove(conversationInDb)
    chatbotConversation.innerHTML = '<div class="speech speech-ai">How can I help you?</div>' // hardcode the initial speech bubble
})

renderConversationFromDb() // render any existing conversation in the database when the app loads