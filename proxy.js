const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Libera o acesso para o seu frontend
app.use(express.json());

app.get('/get-odds', async (req, res) => {
    const token = req.headers.authorization;

    try {
        const response = await axios.get('https://filtrodeapostas.com/api/odds', {
            headers: {
                'authorization': token,
                'Referer': 'https://filtrodeapostas.com/odds',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});

// No seu proxy.js
app.get('/get-details', async (req, res) => {
    const slug = req.query.slug; // Pega o identificador enviado pelo frontend
    const token = req.headers.authorization;

    try {
        const response = await axios.get(`https://filtrodeapostas.com/api/odds/${slug}`, {
            headers: {
                'authorization': token,
                'Referer': 'https://filtrodeapostas.com/odds',
                'User-Agent': 'Mozilla/5.0...'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Erro ao buscar detalhes do jogo");
    }
});

app.listen(3000, () => console.log('Proxy rodando em http://localhost:3000'));