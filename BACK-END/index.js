const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const upload = require('./upload');
const { format } = require('date-fns');
const db = require('./db');
const Joi = require('joi');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const TABLE = "app_alunos";

app.use(express.json());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

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
    }),
    image: Joi.string().optional().allow(null, '').messages({
        'string.empty': 'O campo "image" não pode estar vazio.',
        'string.base': 'O campo "image" deve ser uma URL válida.'
    }),
    old_image: Joi.optional().allow(null, '')
});

const sendResponse = (res, { status, message, error, dados = false, errorCode = null, ...params }) => {
    return res.status(status).json({
        message,
        error,
        errorCode,
        dados,
        ...params
    });
};

const getAluno = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${TABLE} WHERE id = ?`, [id], (err, results) => {
            if (err) {
                reject('Erro ao consultar o banco de dados.');
            } else if (results.length === 0) {
                resolve(false); // Aluno não encontrado
            } else {
                resolve(results[0]); // Aluno encontrado
            }
        });
    });
}

app.get('/', (req, res) => {
    return sendResponse(res, {
        status: 200,
        message: 'Bem-vindo a API do projeto de Avaliação Delta Global!',
        error: false
    });
});

app.get('/alunos', (req, res) => {
    db.query(`SELECT * FROM ${TABLE}`, (err, results) => {
        if (err) {
            return sendResponse(res, {
                status: 500,
                message: 'Erro ao consultar o banco de dados.',
                error: true,
                errorCode: 'DB_ERROR'
            });
        }

        if (results.length === 0) {
            return sendResponse(res, {
                status: 200,
                message: "Nenhum aluno encontrado!",
                error: false
            });
        }

        return sendResponse(res, {
            status: 200,
            message: "Dados encontrados!",
            error: false,
            dados: results
        });
    });
});

app.get('/alunos/:id', (req, res) => {
    const { id } = req.params;

    db.query(`SELECT * FROM ${TABLE} WHERE id = ?`, [id], (err, results) => {
        if (err) {
            return sendResponse(res, {
                status: 500,
                message: 'Erro ao consultar o banco de dados.',
                error: true,
                errorCode: 'DB_ERROR'
            });
        }

        if (results.length === 0) {
            return sendResponse(res, {
                status: 200,
                message: 'Aluno não encontrado.',
                error: false
            });
        }

        return sendResponse(res, {
            status: 200,
            message: "Aluno encontrado!",
            error: false,
            dados: results[0]
        });
    });
});

app.post('/alunos', async (req, res) => {
    const { body } = req;

    const { error } = alunoSchema.validate(body);

    if (error) {
        return sendResponse(res, {
            status: 400,
            message: error.details[0].message,
            error: true,
            errorCode: 'VALIDATION_FIELDS'
        });
    }

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
        await db.execute(query, data);
        return sendResponse(res, {
            status: 201,
            message: 'Cadastro realizado com sucesso!',
            error: false
        });
    } catch (err) {
        return sendResponse(res, {
            status: 500,
            message: 'Erro ao inserir o aluno',
            error: true
        });
    }
});

app.put('/alunos/:id', async (req, res) => {
    const { body, params } = req;
    const { id } = params;

    const { error } = alunoSchema.validate(body);

    if (error) {
        return sendResponse(res, {
            status: 400,
            message: error.details[0].message,
            error: true,
            errorCode: 'VALIDATION_FIELDS'
        });
    }

    const check_exist = await getAluno(id);
    if (!check_exist) {
        return sendResponse(res, {
            status: 400,
            message: "Não foi possivel encontrar o aluno que você esta editando!",
            error: true,
            errorCode: 'NO_EXIST'
        });
    }

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
        await db.execute(query, data);

        if (body.old_image) {
            const filePath = path.join(__dirname, 'images', body.old_image);

            // Verificar se o arquivo existe
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return false;
                }

                // Apagar o arquivo
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return sendResponse(res, {
                            status: 200,
                            message: 'Aluno atualizado com sucesso porem ocorreu um erro ao deletar a imagem antiga!',
                            error: true
                        });
                    }

                    return true;
                });
            });
        }

        return sendResponse(res, {
            status: 200,
            message: 'Aluno atualizado com sucesso!',
            error: false
        });
    } catch (err) {
        console.error(err);
        return sendResponse(res, {
            status: 500,
            message: 'Erro ao atualizar dados do aluno',
            error: true
        });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    const { id } = req.params;

    const check_exist = await getAluno(id);
    if (check_exist && check_exist.image != '' && check_exist.image != undefined && check_exist.image){
        const filePath = path.join(__dirname, 'images', check_exist.image);

        // Verificar se o arquivo existe
        fs.stat(filePath, (err, stats) => {
            if (err) {
                return false;
            }

            // Apagar o arquivo
            fs.unlink(filePath, (err) => {
                if (err) {
                    return sendResponse(res, {
                        status: 200,
                        message: 'Aluno atualizado com sucesso porem ocorreu um erro ao deletar a imagem antiga!',
                        error: true
                    });
                }

                return true;
            });
        });
    }

    const query = `DELETE FROM ${TABLE} WHERE id = ?`;
    try {
        await db.execute(query, [id]);
        return sendResponse(res, {
            status: 200,
            message: 'Aluno deletado com sucesso!',
            error: false
        });
    } catch (err) {
        console.error(err);
        return sendResponse(res, {
            status: 500,
            message: 'Erro ao deletar o aluno',
            error: true
        });
    }
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return sendResponse(res, {
            status: 400,
            message: 'Erro ao fazer upload da imagem. Nenhum arquivo foi encontrado!',
            error: true,
            errorCode: "UPLOAD_IMAGE"
        });
    }

    // O nome do arquivo salvo está disponível em req.file.filename
    const fileName = req.file.filename;

    // res.json({ message: 'Arquivo enviado com sucesso!', fileName: fileName });
    return sendResponse(res, {
        status: 200,
        message: 'Arquivo enviado com sucesso!',
        error: false,
        image_name: fileName
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});