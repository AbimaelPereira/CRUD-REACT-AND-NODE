import { useState, useEffect } from 'react'
import { getAluno, insert_update_aluno, uploadImage } from '../APIService';
import Swal from 'sweetalert2'

const IMAGE_API_URL = import.meta.env.VITE_API_URL + '/images/';

function Modal({ carrega_alunos, notifyUser, ...props }) {
    const [aluno, setAluno] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        endereco: '',
        image: ''
    });
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAluno((prevAluno) => ({
            ...prevAluno,
            [id]: value
        }));
    };

    const carrega_aluno = async (id) => {
        try {
            const data = await getAluno(id);

            if (data.error === false) {
                setAluno({
                    nome: data.dados.nome,
                    sobrenome: data.dados.sobrenome,
                    email: data.dados.email,
                    telefone: data.dados.telefone,
                    endereco: data.dados.endereco,
                    image: data.dados.image
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            let response;

            let new_image = false;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                try {
                    const response_upload_img = await uploadImage(formData); // Função para enviar a imagem para a API

                    if (response_upload_img.error) {
                        notifyUser(response_upload_img.message, 'error');
                        return;
                    }

                    new_image = response_upload_img.image_name; // Nome da imagem retornado pela API
                } catch (err) {
                    setError('Erro ao fazer upload da imagem: ' + err.message);
                    return;
                }
            }

            let dados_save = aluno;

            if (new_image) {
                if (aluno.image) {
                    dados_save = { ...dados_save, old_image: dados_save.image, image: new_image };
                }else{
                    dados_save = { ...dados_save, image: new_image };
                }
            }

            if (props.editingAluno) {
                response = await insert_update_aluno(dados_save, props.editingAluno);
            } else {
                response = await insert_update_aluno(dados_save);
            }

            if (response.error === false) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    carrega_alunos();
                    props.changeModal(false);
                });
            } else {
                if (response.errorCode === "VALIDATION_FIELDS") {
                    notifyUser(response.message, 'error');
                } else {
                    setError('Erro ao salvar o aluno: ' + response.message);
                }
            }
        } catch (err) {
            // Trata erros de rede ou outros problemas com a solicitação
            setError('Erro ao processar a solicitação. Tente novamente. ' + err.message);
        }
    };


    const changeInputFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                document.getElementById("img-preview").src = reader.result;
            };
            reader.readAsDataURL(file); // transforma o arquivo em uma string base64 para visualização
        }
    };

    const clickOnPreviewImage = () => {
        document.getElementById("img-preview").src = IMAGE_API_URL + "avatar_placeholder.png";
        document.getElementById("input-file-hidden").click();
    };

    useEffect(() => {
        if (props.editingAluno) {
            carrega_aluno(props.editingAluno);
        }
    }, [props.editingAluno]);

    return (
        <>
            <div
                className="justify-center bg-gray-900/90 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative max-w-screen-lg my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                            <form onSubmit={submitForm}>
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
                                {/*  */}
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <input onChange={handleInputChange} className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="endereco" type="text" placeholder="Rua exemplo..." value={aluno.endereco} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endereco">
                                            Imagem
                                        </label>
                                        <img
                                            width={100}
                                            id="img-preview"
                                            onClick={clickOnPreviewImage}
                                            className='w-[100px] h-[100px] object-cover rounded-full cursor-pointer border border-gray-300'
                                            src={IMAGE_API_URL + (aluno.image ? aluno.image : "avatar_placeholder.png")}
                                            alt=""
                                        />
                                        <div className='hidden'>
                                            <input onChange={changeInputFile} type="file" id="input-file-hidden" />
                                        </div>
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
                                        type="submit"
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