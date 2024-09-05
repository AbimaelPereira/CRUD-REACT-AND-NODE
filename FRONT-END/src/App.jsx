import { useState } from 'react'
import ModalForm from './components/ModalForm';
import ListagemAlunos from './components/ListagemAlunos';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState(false);

  const changeModal = (showModal, id = false) => {
    setShowModal(showModal);
    setEditingAluno(id);
  }

  return (
    <>
      <div className="bg-gray-800 h-min-screen p-5">
        <div className="flex justify-between">
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
            <ModalForm changeModal={changeModal} editingAluno={editingAluno} />
          ) : null}
        </div>
        <ListagemAlunos changeModal={changeModal} editingAluno={editingAluno} />
      </div>
    </>
  )
}

export default App
