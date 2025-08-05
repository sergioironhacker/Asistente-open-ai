const sendButton = document.querySelector("#sendButton");
const inputElement = document.querySelector("#inputText");
const messagesContainer = document.querySelector(".chat__messages");
const userId = Date.now() + Math.floor(777 + Math.random() * 7000);

// Función que envía el mensaje
async function sendMessage() {
  const inputText = inputElement.value.trim();
  if (!inputText) return;

  // Mostrar mensaje del usuario
  messagesContainer.innerHTML += `
    <div class="chat__message chat__message--user">
      Yo: ${inputText}
    </div>
  `;

  inputElement.value = "";

  try {
    const response = await fetch('/api/chatbot', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: inputText,
        userId,
       })
    });

    const data = await response.json();

    messagesContainer.innerHTML += `
      <div class="chat__message chat__message--bot">
        Bot: ${data.reply}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    messagesContainer.innerHTML += `
      <div class="chat__message chat__message--error">
        ❌ Error al obtener respuesta del bot.
      </div>
    `;
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escuchar clic en el botón
sendButton.addEventListener("click", sendMessage);

// Escuchar tecla Enter en el input
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
