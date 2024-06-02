import React, { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./booking.css";

function BookingList() {
  const [user, setUser] = useState("");
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, loading, reFetch } = useFetch(`/bookings/${id}`);
  console.log(data);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Вы точно хотите отменить бронирование?"
    );
    if (confirmCancel) {
      try {
        await axios.delete(`/users/${id}/bookings/${bookingId}`);
        reFetch();
        alert("Бронирование отменено");
        closeModal();
      } catch (error) {
        console.error("Ошибка при отмене бронирования:", error);
      }
    } else {
      alert("Бронирование не отменено");
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const calculateStatus = (booking) => {
    const currentDate = new Date();
    const startDate = new Date(booking.DateOfStart);
    const endDate = new Date(booking.DateOfEnd);

    if (currentDate >= startDate && currentDate <= endDate) {
      return { text: "В процессе", color: "green" };
    } else if (currentDate < startDate) {
      return { text: "Ожидается", color: "orange" };
    } else {
      return { text: "Завершено", color: "red" };
    }
  };

  return (
    <div className="mainDiv">
      <h2 className="headerBooking">Мои бронирования</h2>
      <div className="booking-list">
        <br />
        {loading && <p>Загрузка...</p>}
        {!loading &&
          data &&
          data.map((booking, index) => (
            <div key={index} className="booking-card">
              <p>
                <strong>Отель:</strong> {booking.rooms[0].hotelName}
              </p>
              <p>
                <strong>Дата заезда:</strong>{" "}
                {new Date(booking.DateOfStart).toLocaleDateString()}
              </p>
              <p>
                <strong>Дата выезда:</strong>{" "}
                {new Date(booking.DateOfEnd).toLocaleDateString()}
              </p>
              <p>
                <strong>Статус:</strong>{" "}
                <span style={{ color: calculateStatus(booking).color }}>
                  {calculateStatus(booking).text}
                </span>
              </p>
              <button className="fullInfo" onClick={() => openModal(booking)}>
                Показать полную информацию
              </button>
              <div className="butCancel">
                <button
                  className="bookCancel"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Отменить
                </button>
              </div>
            </div>
          ))}
      </div>
      {selectedBooking && (
        <Modal
          key={selectedBooking.id}
          booking={selectedBooking}
          cancelBooking={cancelBooking}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

function Modal({ booking, cancelBooking, closeModal }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-container">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Полная информация о бронировании</h2>
        <p className="modal-paragraph">
          <strong>Отель:</strong> {booking.rooms[0].hotelName}
        </p>
        <p className="modal-paragraph">
          <strong>Дата заезда:</strong>{" "}
          {new Date(booking.DateOfStart).toLocaleDateString()}
        </p>
        <p className="modal-paragraph">
          <strong>Дата выезда:</strong>{" "}
          {new Date(booking.DateOfEnd).toLocaleDateString()}
        </p>
        <p className="modal-paragraph">
          <strong>Полная цена:</strong> {booking.FullPrice} р.
        </p>
        <p className="modal-paragraph">
          <strong>Количество взрослых:</strong> {booking.NumberOfAdults}
        </p>
        <p className="modal-paragraph">
          <strong>Количество детей:</strong> {booking.NumberOfChildren}
        </p>
        <h3>Комнаты:</h3>
        <ul className="room-list">
          {booking.rooms.map((room, roomIndex) => (
            <li key={roomIndex} className="room-card">
              <p className="modal-paragraph">
                <strong>Номер комнаты:</strong> {room.roomNumber}
              </p>
              <p className="modal-paragraph">
                <strong>Тип комнаты:</strong> {room.roomTypeName}
              </p>
            </li>
          ))}
        </ul>
        <br />
        <button
          className="bookCancel"
          onClick={() => cancelBooking(booking.id)}
        >
          Отменить
        </button>
      </div>
    </div>
  );
}

export default BookingList;
