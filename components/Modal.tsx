import React from 'react'

interface ModalProps {
  id: string          
  title: string       
  trigger: string     
  children: React.ReactNode  
}

const Modal = ({ id, title, trigger, children }: ModalProps) => {
  return (
    <div>
      
      <button
        className="btn"
        onClick={() => (document.getElementById(id) as HTMLDialogElement).showModal()}
      >
        {trigger}
      </button>

      <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="py-4">{children}</div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Fermer</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Modal