import React, { useState, useEffect } from 'react';
import styles from "./Header.module.css"

/*
 Um componente de exibição de data e hora em tempo real.
 Atualiza a data e hora a cada segundo.
 */
function Data() {
    // Estado para armazenar a data e hora atual
    const [currentTime, setCurrentTime] = useState(new Date());

    // Efeito para atualizar a data e hora a cada segundo
    useEffect(() => {
        // Define um intervalo para atualizar a data e hora a cada segundo
        const intervalId = setInterval(() => {
            setCurrentTime(new Date()); // Atualiza a data e hora atual
        }, 1000); // Atualiza a cada segundo

        // Limpa o intervalo ao desmontar o componente para evitar vazamentos de memória
        return () => clearInterval(intervalId);
    }, []); // Executa apenas uma vez no início

    // Array de meses para mapear o número do mês para o nome do mês
    const meses = ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    // Array de dias da semana para mapear o número do dia para o nome do dia
    const dias_da_semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    // Extrai as partes da data e hora atual
    const currentDate = new Date();
    const hora = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();;
    const min = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
    const dia_da_semana = currentDate.getDay();
    const dia_do_mes = currentDate.getUTCDate();
    const mes = currentDate.getUTCMonth();

    // Renderiza o componente de exibição da data e hora
    return (
        <p className={styles.data}>{dia_do_mes} {meses[mes]} - {dias_da_semana[dia_da_semana]} - {hora}H{min}</p>
    );
}

export default Data;
 