const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { format } = require('date-fns');

const db = require('./db');
const TABLE = "app_alunos";

const Joi = require('joi');
app.use(express.json());

const alunoSchema = Joi.object({
    nome: Joi.string().required().messages({
        'string.empty': 'O campo "nome" é obrigatório.',
        'any.required': 'O campo "nome" é obrigatório.'
    }),
    sobrenome: Joi.string().required().messages({
        'string.empty': 'O campo "sobrenome" é obrigatório.',
        'any.required': 'O campo "sobrenome" é obrigatório.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'O campo "email" deve ser um e-mail válido.',
        'string.empty': 'O campo "email" é obrigatório.',
        'any.required': 'O campo "email" é obrigatório.'
    }),
    telefone: Joi.string().required().messages({
        'string.empty': 'O campo "telefone" é obrigatório.',
        'any.required': 'O campo "telefone" é obrigatório.'
    }),
    endereco: Joi.string().required().messages({
        'string.empty': 'O campo "endereco" é obrigatório.',
        'any.required': 'O campo "endereco" é obrigatório.'
    })
});


app.get('/', (req, res) => {
    res.status(200).json({
        messagem: "Bem-vindo a API do projeto de Avaliação Delta Global!"
    });
});

app.get('/alunos', (req, res) => {
    db.query(`SELECT * FROM ${TABLE}`, (err, results) => {
        if (err) {
            res.status(500).send('Erro ao consultar o banco de dados.');
            return;
        }
        res.json(results);
    });
});

app.get('/alunos/:id', (req, res) => {
    const { id } = req.params;

    db.query(`SELECT * FROM ${TABLE} WHERE id = ?`, [id], (err, results) => {
        if (err) {
            res.status(500).send('Erro ao consultar o banco de dados.');
            return;
        }
        res.json(results);
    });
});

app.post('/alunos', async (req, res) => {
    const { body } = req;

    const { error } = alunoSchema.validate(body);

    if (error) {
        return res.status(400).json({
            error: 'Dados inválidos',
            details: error.details[0].message
        });
    }

    // nome, sobrenome, email, telefone, endereco, image, criado_em, atualizado_em
    const query = `INSERT INTO ${TABLE} (nome, sobrenome, email, telefone, endereco, image, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const data = [
        body.nome,
        body.sobrenome,
        body.email,
        body.telefone,
        body.endereco,
        body.image || null,
        format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    ];

    try {
        const executeQuery = await db.execute(query, data);
        return res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            error: false
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro ao inserir o aluno'
        });
    }
});

app.put('/alunos/:id', async (req, res) => {
    const { body, params } = req;
    const { id } = params;

    const { error } = alunoSchema.validate(body);

    if (error) {
        return res.status(400).json({
            error: 'Dados inválidos',
            details: error.details[0].message
        });
    }

    // nome, sobrenome, email, telefone, endereco, image, criado_em, atualizado_em
    const query = `UPDATE ${TABLE} SET nome = ?, sobrenome = ?, email = ?, telefone = ?, endereco = ?, image = ?, atualizado_em = ? WHERE id = ?`;
    const data = [
        body.nome,
        body.sobrenome,
        body.email,
        body.telefone,
        body.endereco,
        body.image || null,
        format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        id
    ];

    try {
        const executeQuery = await db.execute(query, data);
        return res.status(201).json({
            message: 'Aluno atualizado com sucesso!',
            error: false
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro ao atualizar dados do aluno'
        });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    const { id } = req.params;

    
    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    try {
        const executeQuery = await db.execute(query, [id]);
        return res.status(201).json({
            message: 'Aluno deletado com sucesso!',
            error: false
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Erro ao deletar o aluno'
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
