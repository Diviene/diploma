import "./newHotel.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NewHotelRoom = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null); // Добавлено состояние для ошибки
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("/hotelroomtypes");
        setHotels(response.data);
      } catch (error) {
        console.error("Ошибка:", error);
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

      const list = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dwvifh6bk/image/upload",
            data
          );
          const { url } = uploadRes.data;
          return url;
        })
      );

      newProp = {
        ...newProp,
        photos: list,
        HotelRoomTypeId: selectedHotel,
      };

      await axios.post(`/${path}`, newProp);
      setSuccess(true);
    } catch (err) {
      console.error("Ошибка при создании:", err);
      setError(err.response.data.error);
      alert(err.response.data.error);
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
        <div className="left">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`image-${index}`}
            />
          ))}
          <div className="formInput">
            <label htmlFor="file">
              Image: <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFiles([...files, ...e.target.files])}
              style={{ display: "none" }}
              multiple
            />
          </div>
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
              <label htmlFor="hotelroomtype">Тип комнаты</label>
              <select
                id="hotelroomtype"
                onChange={handleHotelChange}
                value={selectedHotel}
              >
                <option value="">Выберите тип комнаты</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.Name}
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

export default NewHotelRoom;
