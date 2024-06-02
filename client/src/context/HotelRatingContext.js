import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Создание контекста
const HotelRatingContext = createContext();

// Создание провайдера контекста
const HotelRatingProvider = ({ children }) => {
  const [hotelRatings, setHotelRatings] = useState([]);

  // Получение данных о рейтингах отелей с сервера
  useEffect(() => {
    const fetchHotelRatings = async () => {
      try {
        const response = await axios.get('/api/hotelRatings'); // Замените '/api/hotelRatings' на ваш эндпоинт
        setHotelRatings(response.data);
      } catch (error) {
        console.error('Error fetching hotel ratings:', error);
      }
    };

    fetchHotelRatings();
  }, []);

  return (
    <HotelRatingContext.Provider value={{ hotelRatings }}>
      {children}
    </HotelRatingContext.Provider>
  );
};

export { HotelRatingContext, HotelRatingProvider };