import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useState } from "react";

const SingleHotelRating = () => {
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

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация</h1>
              <Link to="/hotelratings" className="backButton">
                Назад к списку рейтингов
              </Link>
            </div>
            <div className="item">
              <img src={data.photo} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">
                  Количество звезд отеля: {data.HotelRatingStars}
                </h1>
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

export default SingleHotelRating;
