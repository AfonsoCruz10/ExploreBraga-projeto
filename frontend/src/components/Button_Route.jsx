import React from 'react';
import { useNavigate } from 'react-router-dom';

/* 
Um componente de botão que navega para uma página específica ao ser clicado.
Utiliza o hook useNavigate do React Router DOM para a navegação.

props - As propriedades do componente.
props.page - O caminho da página para a qual navegar.
props.class_button - A classe CSS para aplicar ao botão.
props.class_button_name - A classe CSS para aplicar ao nome do botão.
props.name - O texto a ser exibido no botão.
 */
function Button_Route (props) {
    // Hook para navegação
    const navigate = useNavigate();

    /*
    Manipulador de evento para lidar com o clique do botão.
    Navega para a página especificada nas propriedades.
     */
    const handleClick = () => {
        navigate(props.page); // Navega para a página especificada nas propriedades
    };

    // Renderiza o componente de botão
    return (
        <button onClick={handleClick} className={props.class_button}>
            {/* Parágrafo dentro do botão para exibir o nome do botão */}
            <p className={props.class_button_name}>{props.name}</p>
        </button>
    );
}

// Exporta o componente Button_Route como exportação padrão
export default Button_Route;