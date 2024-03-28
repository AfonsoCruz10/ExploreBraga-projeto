/* NAO ESTA A SER UTILIZADO */

/*EM PRINCIPIO É PARA MUDAR PARA BUTTON E IMPLEMENTAR*/


import React, { useState } from 'react';

function Switch() {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    document.body.style.backgroundColor = isChecked ? 'white' : 'black';
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={handleToggle} checked={isChecked} />
      <span className="slider round"></span>
    </label>
  );
}

export default Switch;