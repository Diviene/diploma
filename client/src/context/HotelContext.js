import React, { createContext, useState, useEffect } from 'react';

export const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
  const [hotelId, setHotelId] = useState(() => {
    const savedHotelId = localStorage.getItem("hotelId");
    return savedHotelId ? JSON.parse(savedHotelId) : undefined;
  });

  useEffect(() => {
    if (hotelId !== undefined) {
      localStorage.setItem("hotelId", JSON.stringify(hotelId));
    } else {
      localStorage.removeItem("hotelId");
    }
  }, [hotelId]);

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId }}>
      {children}
    </HotelContext.Provider>
  );
};