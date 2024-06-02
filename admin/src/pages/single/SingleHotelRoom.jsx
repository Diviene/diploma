import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useState } from "react";

const SingleHotelRoom = () => {
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

  const { HotelRoomNumber, photos, IsAvailable, HotelRoomType } = data;
  console.log(photos);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация</h1>
              <Link to="/hotelrooms" className="backButton">
                Назад к списку типов комнат
              </Link>
            </div>
            <div className="item">
              <div className="details">
                {photos && photos.length > 0 && (
                  <div className="photosContainer">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="photoItem"
                      />
                    ))}
                  </div>
                )}
                <div className="detailItem">
                  <span className="itemKey">
                    Номер комнаты: {HotelRoomNumber}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Тип комнаты: {HotelRoomType}</span>
                </div>
                <div className="buttons">
                  <div className="buttonWrapper">
                    <Link to={`/${path}/${id}/edit`}>
                      <button className="editButton">Редактировать</button>
                    </Link>
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

export default SingleHotelRoom;
