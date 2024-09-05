
import { useEffect, useState } from 'react';
import { getAlunos, deleteAluno } from '../APIService';
import Swal from 'sweetalert2'


function ListagemAlunos({ ...props }) {
    const [alunos, setAlunos] = useState([]);
    const [error, setError] = useState(null);

    const loadAlunos = async () => {
        try {
            const data = await getAlunos();
            if (data.error === false) {
                setAlunos(data.dados);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadAlunos();
    }, []);

    const deleteButton = (id_aluno) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Essa ação não pode ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {    
                //deleteAluno
                try {
                    const data = await deleteAluno(id_aluno);
                    if (data.error === false) {
                        Swal.fire(
                            'Deletado!',
                            'O aluno foi deletado com sucesso.',
                            'success'
                        );
                    }
                } catch (err) {
                    setError(err.message);
                }
            }
        });
    };

    return (
        <>
            <table className="min-w-full text-left text-sm font-light text-white">
                <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                        <th scope="col" className="px-6 py-4">Nome</th>
                        <th scope="col" className="px-6 py-4">Telefone</th>
                        <th scope="col" className="px-6 py-4">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <>
                            <tr key={aluno.id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className='text-xl'>
                                        {aluno.nome + ' ' + aluno.sobrenome}
                                    </p>
                                    <p className='text-sm'>
                                        {aluno.email}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {aluno.telefone}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => props.changeModal(true, aluno.id)}
                                        className="border mr-2  border-yellow-500 rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="border border-red-500 rounded-lg px-3 py-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200"
                                        onClick={() => deleteButton(aluno.id)}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ListagemAlunos;