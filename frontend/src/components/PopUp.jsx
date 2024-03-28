/* NAO ESTA A SER UTILIZADO */



import React, { useState } from 'react';

const PopUp = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <a href="#" onClick={handleClick}>{props.nome}</a>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <span className='register'>
                <p>Email: </p>
                <p>Username:</p>
                <p>Password: </p>
                <p>Confirm Password:</p>
            </span>  
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUp;
