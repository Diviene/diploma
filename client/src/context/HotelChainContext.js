import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Создание контекста
const HotelChainContext = createContext();

// Создание провайдера контекста
const HotelChainProvider = ({ children }) => {
  const [hotelChains, setHotelChains] = useState([]);

  // Получение данных о сетях отелей с сервера
  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const response = await axios.get('/api/hotelChains'); // Замените '/api/hotelChains' на ваш эндпоинт
        setHotelChains(response.data);
      } catch (error) {
        console.error('Error fetching hotel chains:', error);
      }
    };

    fetchHotelChains();
  }, []);

  return (
    <HotelChainContext.Provider value={{ hotelChains }}>
      {children}
    </HotelChainContext.Provider>
  );
};

export { HotelChainContext, HotelChainProvider };