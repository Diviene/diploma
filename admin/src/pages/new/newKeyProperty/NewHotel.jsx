import "./newHotel.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NewHotel = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [files, setFiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [hotelChains, setHotelChains] = useState([]);
  const [hotelRatings, setHotelRatings] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHotelChain, setSelectedHotelChain] = useState("");
  const [selectedHotelRating, setSelectedHotelRating] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get("/cities");
      setCities(response.data);
    };

    const fetchHotelChains = async () => {
      const response = await axios.get("/hotelchains");
      setHotelChains(response.data);
    };

    const fetchHotelRatings = async () => {
      const response = await axios.get("/hotelratings");
      setHotelRatings(response.data);
    };

    fetchCities();
    fetchHotelChains();
    fetchHotelRatings();
  }, []);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleHotelChainChange = (e) => {
    setSelectedHotelChain(e.target.value);
  };

  const handleHotelRatingChange = (e) => {
    setSelectedHotelRating(e.target.value);
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
        CityId: selectedCity,
        HotelChainId: selectedHotelChain,
        HotelRatingId: selectedHotelRating,
      };

      await axios.post(`/${path}`, newProp);
      setSuccess(true);
    } catch (err) {
      console.log(err);
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
              <label htmlFor="city">Город</label>
              <select
                id="city"
                onChange={handleCityChange}
                value={selectedCity}
              >
                <option value="">Выберите город</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="formInput">
              <label htmlFor="hotelChain">Сеть отелей</label>
              <select
                id="hotelChain"
                onChange={handleHotelChainChange}
                value={selectedHotelChain}
              >
                <option value="">Выберите сеть отелей</option>
                {hotelChains.map((chain) => (
                  <option key={chain._id} value={chain._id}>
                    {chain.HotelChainName}
                  </option>
                ))}
              </select>
            </div>
            <div className="formInput">
              <label htmlFor="hotelRating">Рейтинг отеля</label>
              <select
                id="hotelRating"
                onChange={handleHotelRatingChange}
                value={selectedHotelRating}
              >
                <option value="">Выберите рейтинг</option>
                {hotelRatings.map((rating) => (
                  <option key={rating._id} value={rating._id}>
                    {rating.HotelRatingStars}
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

export default NewHotel;
