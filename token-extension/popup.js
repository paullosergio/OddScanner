const btn = document.getElementById("getToken")
const messageBox = document.getElementById("message")

const ext = typeof browser !== "undefined" ? browser : chrome

function showMessage(text, type) {
	messageBox.className = type
	messageBox.style.display = "flex"

	let icon = ""

	if (type === "success") icon = "✔"
	if (type === "error") icon = "❌"
	if (type === "loading") icon = `<div class="spinner"></div>`

	messageBox.innerHTML = `
    <span class="icon">${icon}</span>
    <span>${text}</span>
  `

	if (type !== "loading") {
		setTimeout(() => {
			messageBox.style.display = "none"
		}, 3000)
	}
}

btn.addEventListener("click", async () => {
	btn.disabled = true
	showMessage("Capturando token...", "loading")

	try {
		const [tab] = await ext.tabs.query({
			active: true,
			currentWindow: true,
		})

		ext.scripting.executeScript(
			{
				target: { tabId: tab.id },
				func: () => {
					return (
						localStorage.getItem("token") ||
						localStorage.getItem("access_token") ||
						localStorage.getItem("jwt") ||
						localStorage.getItem("auth_token")
					)
				},
			},
			async (results) => {
				if (!results || !results[0] || !results[0].result) {
					showMessage("Token não encontrado.", "error")
					btn.disabled = false
					return
				}

				const token = results[0].result

				await fetch("https://oddscanner.onrender.com/save-token", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				})

				showMessage("Token sincronizado com sucesso!", "success")

				setTimeout(() => {
					window.close()
				}, 1500)
			},
		)
	} catch (err) {
		showMessage("Erro ao enviar token.", "error")
		btn.disabled = false
	}
})
