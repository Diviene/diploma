import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useState } from "react";

const SingleBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/${path}/${id}`);
      alert("Успешно удалено");
      navigate(`/${path}`);
    } catch (err) {
      console.error("Error deleting the item", err);
      alert("Ошибка при удалении");
    } finally {
      setDeleting(false);
    }
  };

  const { data, loading, error } = useFetch(`/${path}/${id}`);

  const {
    DateOfStart,
    DateOfEnd,
    NumberOfAdults,
    NumberOfChildren,
    FullPrice,
    User,
    HotelRoomType,
    HotelRoomIds,
    Hotel,
  } = data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // добавляем 1, так как месяцы начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formattedDateOfStart = formatDate(DateOfStart);
  const formattedDateOfEnd = formatDate(DateOfEnd);

  const currentDate = new Date();
  let status = "";
  let statusColor = "";

  if (currentDate < new Date(DateOfStart)) {
    status = "ожидается";
    statusColor = "orange";
  } else if (
    currentDate >= new Date(DateOfStart) &&
    currentDate <= new Date(DateOfEnd)
  ) {
    status = "В процессе";
    statusColor = "green";
  } else {
    status = "завершен";
    statusColor = "red";
  }

  const roomIdsDisplay = HotelRoomIds ? HotelRoomIds.join(", ") : "";
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация</h1>
              <Link to="/bookings" className="backButton">
                Назад к списку бронирований
              </Link>
            </div>
            <div className="item">
              <div className="details">
                <div className="detailItem">
                  <span className="itemKey">Пользователь: {User}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Дата начала: {formattedDateOfStart}
                  </span>
                  <span className="itemKey">
                    Дата окончания: {formattedDateOfEnd}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Количество взрослых: {NumberOfAdults}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Количество детей: {NumberOfChildren}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Цена: {FullPrice} р.</span>
                </div>
                <div className="detailItem">
                  <span className={`itemKey status ${statusColor}`}>
                    Статус: {status}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Отель: {Hotel}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Тип комнаты: {HotelRoomType}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Номера комнат: {roomIdsDisplay}
                  </span>
                </div>
                <div className="buttons">
                  <div className="buttonWrapper">
                    <button
                      className="deleteButton"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Удаление..." : "Удалить"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBooking;
