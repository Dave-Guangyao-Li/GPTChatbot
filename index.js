import { Configuration, OpenAIApi } from 'openai'
import { process } from './env'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)
const conversationArr = [{
    role: "system",
    content: "You are a highly knowledgeable assistant that is always happy to help."
}] // stores the conversation history

const chatbotConversation = document.getElementById('chatbot-conversation')

document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')
    conversationArr.push({
        role: "user",
        content: userInput.value
    })// Push an object holding the user's input to conversationArr.
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight  // move dialogue to bottom of chatbot conversation ,so that it is always visible
})

async function fetchReply() {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationArr
    })
    console.log(response)
}

// render a blinking cursor to indicate that the chatbot is typing, then render the chatbot's response. By repeatedly adding characters to the speech bubble element with a slight delay, the text appears as if it is being typed out, and the added 'blinking-cursor' class creates a blinking effect.
function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i - 1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}