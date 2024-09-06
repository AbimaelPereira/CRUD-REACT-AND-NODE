import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAlunos = async () => {
    try {
        const response = await axios.get(BASE_URL + '/alunos');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar alunos: ' + (error.message || 'Desconhecido'));
    }
}

export const getAluno = async (id) => {
    try {
        const response = await axios.get(BASE_URL + '/alunos/' + id);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar aluno');
    }
}

export const deleteAluno = async (id) => {
    try {
        const response = await axios.delete(BASE_URL + '/alunos/' + id);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao deletar aluno');
    }
};

export const insert_update_aluno = async (dados, id = false) => {
    try {
        let response;
        if (id) {
            response = await axios.put(BASE_URL + '/alunos/' + id, dados);
        } else {
            response = await axios.post(BASE_URL + '/alunos', dados);
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw new Error('Erro ao salvar aluno');
    }
}

export const uploadImage = async (formData) => {
    try {
        const response = await axios.post(BASE_URL + '/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        // Trata erros de rede ou outros problemas com a solicitação
        return { error: true, message: error.response?.data?.message || 'Erro ao fazer upload da imagem' };
    }
};