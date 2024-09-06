const IMAGE_API_URL = import.meta.env.VITE_API_URL + '/images/';

function ListagemAlunos({ lista_alunos = [], deleta_aluno, ...props }) {
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
                    {lista_alunos.length > 0 ? (
                        <>
                            {lista_alunos.map((aluno) => (
                                <tr key={aluno.id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                    <td className="whitespace-nowrap px-6 py-4 flex gap-2">
                                        <img
                                            width={50}
                                            className='w-[50px] h-[50px] object-cover rounded-full border border-gray-300'
                                            src={IMAGE_API_URL + (aluno.image ? aluno.image : "avatar_placeholder.png")}
                                        />
                                        <div>
                                            <p className='text-xl'>
                                                {aluno.nome + ' ' + aluno.sobrenome}
                                            </p>
                                            <p className='text-sm'>
                                                {aluno.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {aluno.telefone}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => props.changeModal(true, aluno.id)}
                                            className="border mr-2 border-yellow-500 rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="border border-red-500 rounded-lg px-3 py-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200"
                                            onClick={() => deleta_aluno(aluno.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td colSpan="3" className="whitespace-nowrap px-6 py-4 text-center text-gray-500">
                                Nenhum aluno encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </>
    );
}

export default ListagemAlunos;