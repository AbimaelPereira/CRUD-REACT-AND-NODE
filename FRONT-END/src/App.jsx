import { useState, useEffect } from 'react'
import ModalForm from './components/ModalForm';
import ListagemAlunos from './components/ListagemAlunos';
import { getAlunos, deleteAluno } from './APIService';
import Swal from 'sweetalert2'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function notifyUser(message, type) {
  const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark"
  }

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
}


function App() {
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState(false);
  const [alunos, setAlunos] = useState([]);

  const carrega_alunos = async () => {
    try {
      const data = await getAlunos();
      if (data.error === false) {
        if (data.dados.length === 0) {
          setAlunos([]);
        } else {
          setAlunos(data.dados);
        }
      } else {
        // setError(data.message);
      }
    } catch (err) {
      // setError(err.message);
    }
  };

  const deleta_aluno = (id_aluno) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      reverseButtons: true,
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
            carrega_alunos();
          }
        } catch (err) {
          console.log('erro');
        }
      }
    });
  };

  const changeModal = (showModal, id = false) => {
    setShowModal(showModal);
    setEditingAluno(id);
  }

  useEffect(() => {
    carrega_alunos();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-800 h-screen p-5">
        <div className="flex justify-between mb-10">
          <div className='text-white'>
            <h1 className="text-2xl	font-bold">
              Seja Bem-Vindo!
            </h1>
            <p>
              Aqui você vê os alunos cadastrados!
            </p>
          </div>
          <button onClick={() => changeModal(true)} className='border border-neutral-300 font-semibold hover:bg-white hover:text-gray-500 hover:border-none text-white rounded-lg px-3 py-1'>
            Cadastrar novo aluno
          </button>
          {showModal ? (
            <ModalForm notifyUser={notifyUser} changeModal={changeModal} editingAluno={editingAluno} carrega_alunos={carrega_alunos} />
          ) : null}
        </div>
        <ListagemAlunos deleta_aluno={deleta_aluno} lista_alunos={alunos} changeModal={changeModal} editingAluno={editingAluno} />
      </div>
    </>
  )
}

export default App
