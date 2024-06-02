import "./newHotel.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NewHotelRoomType = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); // Добавлено состояние для ошибки
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("/hotels");
        setHotels(response.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
  };

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let newProp = { ...info };

      newProp = {
        ...newProp,
        HotelId: selectedHotel,
      };

      await axios.post(`/${path}`, newProp);
      setSuccess(true);
    } catch (err) {
      console.error("Error creating hotel room type:", err);
      setError(err.response.data.error); // Установка ошибки из ответа сервера
      alert(err.response.data.error); // Отображение ошибки через alert
    }
  };

  useEffect(() => {
    if (success) {
      let message;
      switch (path) {
        case "cities":
          message = "Город успешно добавлен!";
          break;
        case "hotelchains":
          message = "Сеть отелей успешно добавлена!";
          break;
        case "hotelratings":
          message = "Рейтинг успешно добавлен!";
          break;
        default:
          message = "Элемент успешно добавлен!";
      }
      alert(message);
      navigate(`/${path}`);
    }
  }, [success, navigate, path]);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="right">
          <form>
            {inputs.map((input) => (
              <div className="formInput" key={input.id}>
                <label>{input.label}</label>
                <input
                  onChange={handleChange}
                  type={input.type}
                  placeholder={input.placeholder}
                  id={input.id}
                />
              </div>
            ))}
            <div className="formInput">
              <label htmlFor="hotel">Отель</label>
              <select
                id="hotel"
                onChange={handleHotelChange}
                value={selectedHotel}
              >
                <option value="">Выберите отель</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.HotelName}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleClick}>Принять</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewHotelRoomType;
