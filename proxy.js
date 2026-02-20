const express = require("express")
const axios = require("axios")
const cors = require("cors")
const API_URL = process.env.API_URL
const API_REFERRER = process.env.API_REFERRER
const app = express()
app.use(cors()) // Libera o acesso para o seu frontend
app.use(express.json())

app.get("/status", (req, res) => {
	res.status(200).json({
		ok: true,
		tokenConfigured: !!SAVED_TOKEN,
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	})
})

app.get("/get-odds", async (req, res) => {
	if (!SAVED_TOKEN) {
		return res.status(401).json({
			error: "Token não configurado",
		})
	}

	try {
		const response = await axios.get(API_URL, {
			headers: {
				authorization: `Bearer ${SAVED_TOKEN}`,
				Referer: API_REFERRER,
				"User-Agent":
					"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
			},
		})

		res.json(response.data)
	} catch (e) {
		res.status(e.response?.status || 500).json({
			error: "Erro ao buscar odds",
			details: e.response?.data || e.message,
		})
	}
})

let SAVED_TOKEN = ""

app.post("/save-token", (req, res) => {
	SAVED_TOKEN = req.body.token

	res.json({
		ok: true,
	})
})

app.get("/get-token", (req, res) => {
	res.json({
		token: SAVED_TOKEN,
	})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))
