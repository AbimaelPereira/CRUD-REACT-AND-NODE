import axios from 'axios';

export const getAlunos = async () => {
    try {
        const response = await axios.get('http://localhost:3000/alunos');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar alunos');
    }
}

export const getAluno = async (id) => {
    try {
        const response = await axios.get('http://localhost:3000/alunos/' + id);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar aluno');
    }
}

export const deleteAluno = async (id) => {
    try {
        const response = await axios.delete('http://localhost:3000/alunos/' + id);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao deletar aluno');
    }
};