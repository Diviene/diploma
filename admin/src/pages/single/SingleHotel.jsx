import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SingleHotel = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/${path}/${id}`);

  const {
    HotelName,
    photos,
    HotelAddress,
    HotelPostcode,
    HotelDescription,
    City,
    HotelChain,
    HotelRating,
  } = data;

  if (loading || !data) {
    return <div>Загрузка...</div>;
  }

  console.log(photos);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация</h1>
              <Link to="/hotels" className="backButton">
                Назад к списку сетей отелей
              </Link>
            </div>
            <div className="item">
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
              <div className="details">
                <h1 className="itemTitle"></h1>
                <div className="detailItem">
                  <span className="itemKey">Название: {HotelName}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Адрес: {HotelAddress}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Почтовый индекс: {HotelPostcode}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Описание: {HotelDescription}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Город: {City}</span>
                  <span className="itemValue"></span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Ретинг отеля: {HotelRating} звезд
                  </span>
                  <span className="itemValue"></span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Сеть отелей: {HotelChain}</span>
                  <span className="itemValue"></span>
                </div>
                <div className="buttons">
                  <div className="buttonWrapper">
                    <Link to={`/${path}/${id}/edit`}>
                      <button className="editButton">Редактировать</button>
                    </Link>
                    <button className="deleteButton">Удалить</button>
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

export default SingleHotel;
