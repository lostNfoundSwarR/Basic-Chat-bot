const promptInput = document.querySelector("#prompt-input");
const subBtn = document.querySelector(".submit-btn i");
const msgContainer = document.querySelector(".msg-container");

const apiKey = "AIzaSyASRjT5dEdKKt2XFRjbR4dJVPKelOyAoIw";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const c1 = "outgoing-msg"; 
const c2 = "incoming-msg";

const chatHistory = [];

console.log(c2);

function createMsg(type, text) {
    let msgEle = document.createElement("div");
    let msgTxt = document.createElement("span");

    msgTxt.textContent = text;

    if(type === c1) {
        msgEle.classList.add("msg", c1);
    }
    else {
        msgEle.classList.add("msg", c2);
    }

    msgEle.appendChild(msgTxt);
    return msgEle;
}

async function sendReq() {
    let prompt = promptInput.value.trim();
    promptInput.value = "";

    if (prompt === "") {
        return;
    }

    chatHistory.push({
        role: "user",
        parts: [{text: prompt}]
    });

    const userMsg = createMsg(c1, prompt);
    msgContainer.appendChild(userMsg);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({contents: chatHistory})
        });

        const data = await response.json();

        if(!response.ok) throw new Error(data.error.message);

        console.log(data);

        const responseTxt = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "\n");
        console.log(responseTxt)

        const botMsg = createMsg(c2, responseTxt);
        msgContainer.appendChild(botMsg);
    }
    catch(error) {
        console.error(error);
    }

    msgContainer.scrollTop = msgContainer.scrollHeight;
}

subBtn.addEventListener("click", () => {
    sendReq();
});

document.addEventListener("keydown", (event) => {
    if(event.key == "Enter") {
        sendReq();
    }
});
