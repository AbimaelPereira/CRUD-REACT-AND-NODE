import { useState, useEffect } from 'react'
import { getAluno } from '../APIService';


function Modal({ ...props }) {
    const [aluno, setAluno] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        endereco: '',
        image: ''
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAluno((prevAluno) => ({
            ...prevAluno,
            [id]: value
        }));
    };

    const loadAluno = async (id) => {
        try {
            const data = await getAluno(id);

            if (data.error === false) {
                setAluno(data.dados);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (props.editingAluno) {
            loadAluno(props.editingAluno);
        }
    }, [props.editingAluno]);

    return (
        <>
            <div
                className="justify-center bg-gray-900/90 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*body*/}
                        {/* nome, sobrenome, email, telefone, endereco, image */}
                        <div className="relative p-6 flex-auto">
                            <div className='mb-6 px-3'>
                                <h3 className='text-2xl text-gray-700 font-semibold'>
                                    {props.editingAluno ? 'Edite o aluno' : 'Cadastre um aluno'}
                                </h3>
                                <p className='text-gray-700'>
                                    {props.editingAluno ? 'Aqui você pode editar os dados do aluno' : 'Aqui você pode cadastrar um novo aluno'}
                                </p>
                            </div>
                            <form>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nome">
                                            Nome *
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="nome" type="text" placeholder="Nome" value={aluno.nome} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="sobrenome">
                                            Sobrenome *
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="sobrenome" type="text" placeholder="Sobrenome" value={aluno.sobrenome} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                            Email *
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="email" type="email" placeholder="exemplo@email.com.br" value={aluno.email} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="telefone">
                                            Telefone *
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="telefone" type="text" placeholder="00 9 0000-0000" value={aluno.telefone} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="endereco" type="text" placeholder="Rua exemplo..." value={aluno.endereco} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        className="text-red-500 background-transparent border-2 hover:border-red-500 rounded font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-50"
                                        type="button"
                                        onClick={() => props.changeModal(false)}
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        className="text-green-500 background-transparent border-2 hover:border-green-500 rounded font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-50"
                                        type="button"
                                        onClick={() => props.changeModal(false)}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}

export default Modal