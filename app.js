const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const fileInput = document.getElementById("fileInput");
const micBtn = document.getElementById("micBtn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return div;
}

function addError(text) {
  const div = document.createElement("div");
  div.className = "msg error";
  div.textContent = text;
  messagesDiv.appendChild(div);
}

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  const typing = addMessage("Typing...", "assistant");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    typing.remove();

    if (!res.ok || !data.reply) {
      addError("Server error or empty reply");
      return;
    }

    addMessage(data.reply, "assistant");
  } catch (err) {
    typing.remove();
    addError("Network or server error");
  }
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    addMessage(`📎 Attached: ${file.name}`, "user");
  }
});

micBtn.addEventListener("click", () => {
  addMessage("🎤 Voice input coming soon", "assistant");
});
