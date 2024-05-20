import React, { useState, useEffect } from "react";
import { TbRectangleVerticalFilled } from "react-icons/tb";






// Chave e URL base para acessar a API de previsão do tempo
const api = {
    key: "69f27d6f651417a4db87a0d2b498b441",
    base: "https://api.openweathermap.org/data/2.5",
};

/**
 * Função assíncrona para buscar os dados meteorológicos atuais de Braga na API de previsão do tempo.
 * Retorna os dados meteorológicos se bem-sucedidos, caso contrário, retorna null.
 * 
 * @returns {Object|null} Retorna os dados meteorológicos atuais de Braga ou null em caso de erro.
 */
const fetchWeatherData = async () => {
    try {
        const response = await fetch(`${api.base}/weather?q=Braga&appid=${api.key}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
};

/**
 * Converte a temperatura de Kelvin para Celsius.
 * 
 * @param {number} tempInKelvin - Temperatura em Kelvin.
 * @returns {number} Retorna a temperatura em Celsius.
 */
const kelvinToCelsius = (tempInKelvin) => {
    return tempInKelvin - 273.15;
};

/**
 * Função assíncrona para obter a temperatura atual de Braga em Celsius.
 * 
 * @returns {number|null} Retorna a temperatura atual de Braga em Celsius ou null em caso de erro.
 */
const getWeatherTemperature = async () => {
    const weatherData = await fetchWeatherData();
    if (weatherData) {
        return kelvinToCelsius(weatherData.main.temp);
    } else {
        return null;
    }
};

const getWeatherEmoji = async () => {
    const weatherEmoji = await fetchWeatherData();
    if (weatherEmoji) {
        return "http://openweathermap.org/img/w/" + weatherEmoji.weather[0].icon + ".png";
    }
}

/*
Um componente que exibe a temperatura atual de Braga, Portugal.
A temperatura é atualizada a cada minuto e é colorida de acordo com faixas de temperatura.

props - As propriedades do componente.
props.name - O nome da classe CSS para styling.
 
 */
function Temp(props) {
    // Estado para armazenar a temperatura atual
    const [temperature, setTemperature] = useState(null);
    const [emoji, setEmoji] = useState(null);

    // Efeito para carregar a temperatura atual e atualizá-la a cada minuto
    useEffect(() => {
        const loadTemperature = async () => {
            const temp = await getWeatherTemperature();
            const emoj = await getWeatherEmoji();
            setTemperature(temp);
            setEmoji(emoj);
        };
        loadTemperature();
        const intervalId = setInterval(loadTemperature, 60 * 1000); // Atualiza a cada minuto
        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    /*
    Retorna a cor associada à faixa de temperatura fornecida.
    
    temp - A temperatura em Celsius.

     */
    const getTemperatureColor = (temp) => {
        // Define as faixas de temperatura e suas cores correspondentes
        if (temp >= 25) {
            return "#FF5733"; // Laranja avermelhado
        } else if (temp >= 20) {
            return "#FF884B"; // Laranja claro
        } else if (temp >= 15) {
            return "#FFB366"; // Pêssego
        } else if (temp >= 10) {
            return "#FFE0A3"; // Pêssego claro
        } else if (temp >= 5) {
            return "#EBF2FA"; // Azul claro
        } else if (temp >= 0) {
            return "#CCE0FF"; // Azul celeste claro
        } else if (temp >= -5) {
            return "#99C2FF"; // Azul celeste
        } else if (temp >= -10) {
            return "#66A3FF"; // Azul claro
        } else if (temp >= -15) {
            return "#3385FF"; // Azul
        } else if (temp >= -20) {
            return "#0057FF"; // Azul escuro
        } else if (temp >= -25) {
            return "#003D99"; // Azul profundo
        } else {
            return "#001A66"; // Azul muito escuro
        }
    };

    // Renderiza o componente de exibição da temperatura
    return (
        <>
            <p className={props.name}>
                <img src={emoji} style={{ height: "30px", marginLeft: "20px" }} />
            </p>
            <p className={props.name} style={{ color: "white" }} >

                {/* Exibe a temperatura arredondada e colorida, juntamente com o nome da cidade */}
                {Math.round(temperature)} ºC
                < span style={{ color: getTemperatureColor(temperature) }} />
            </p >

        </>
    );
}

export default Temp;