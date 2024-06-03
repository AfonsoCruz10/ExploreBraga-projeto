import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function MyMap({ address }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // Inicializa o mapa
    const newMap = L.map('map').setView([41.5503, -8.4201], 14); // Coordenadas de Braga

    // Adiciona a camada de azulejos (tile layer) do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newMap);

    setMap(newMap);

    // Remove o mapa quando o componente é desmontado
    return () => {
      newMap.remove();
    };
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        if (address) {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`);
          if (response.data && response.data.length > 0) {
            const { lat, lon, display_name } = response.data[0];
            const newLatLng = [parseFloat(lat), parseFloat(lon)];
            map.setView(newLatLng, 14);
            if (marker) {
              marker.setLatLng(newLatLng).bindPopup(display_name).openPopup();
            } else {
              const newMarker = L.marker(newLatLng, { draggable: false }).addTo(map).bindPopup(display_name).openPopup();
              setMarker(newMarker);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
      }
    };

    if (map) {
      fetchCoordinates();
    }
  }, [map, address]); // Adiciona 'address' como dependência para que o efeito seja executado quando o endereço mudar

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}></div>
  );
}

export default MyMap;
