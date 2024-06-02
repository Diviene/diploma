import "./edit.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const EditHotelRoomType = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("/hotel");
        setHotels(response.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await axios.get(`/${path}/${id}`);
        setInfo(response.data);
        setSelectedHotel(response.data.HotelId);
      } catch (error) {
        console.error("Error fetching object:", error);
      }
    };
    fetchObject();
  }, [id, path]);

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
      let updatedInfo = { ...info, HotelId: selectedHotel };
      await axios.put(`/${path}/${id}`, updatedInfo);
      setSuccess(true);
    } catch (err) {
      console.error("Error updating object:", err);
      setError(err.response.data.error);
      alert(err.response.data.error);
    }
  };

  useEffect(() => {
    if (success) {
      let message;
      switch (path) {
        case "cities":
          message = "Город успешно обновлен!";
          break;
        case "hotelchains":
          message = "Сеть отелей успешно обновлена!";
          break;
        case "hotelratings":
          message = "Рейтинг успешно обновлен!";
          break;
        default:
          message = "Элемент успешно обновлен!";
      }
      alert(message);
      navigate(`/${path}`);
    }
  }, [success, navigate, path]);

  const { data, loading } = useFetch(`/${path}/${id}`);

  const { Hotel } = data;

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="links">
          <Link to={`/${path}`} className="button">
            Назад к списку
          </Link>
          <Link to={`/${path}/${id}`} className="button">
            Назад к элементу
          </Link>
        </div>
        <br />
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
                  value={info[input.id] || ""}
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
                <option value="">{Hotel}</option>
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

export default EditHotelRoomType;
