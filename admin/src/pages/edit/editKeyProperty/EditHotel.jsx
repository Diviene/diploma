import "./edit.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const EditHotel = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];
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

    const fetchHotelInfo = async () => {
      const response = await axios.get(`/${path}/${id}`);
      setInfo(response.data);
      setSelectedCity(response.data.CityId);
      setSelectedHotelChain(response.data.HotelChainId);
      setSelectedHotelRating(response.data.HotelRatingId);
    };

    fetchCities();
    fetchHotelChains();
    fetchHotelRatings();
    fetchHotelInfo();
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
      let updatedInfo = { ...info };

      const newFiles = files.filter((file) => !file.url);

      if (newFiles.length > 0) {
        const uploadedPhotos = await Promise.all(
          newFiles.map(async (file) => {
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

        updatedInfo = {
          ...updatedInfo,
          photos: [...updatedInfo.photos, ...uploadedPhotos],
          CityId: selectedCity,
          HotelChainId: selectedHotelChain,
          HotelRatingId: selectedHotelRating,
        };
      } else {
        updatedInfo = {
          ...updatedInfo,
          CityId: selectedCity,
          HotelChainId: selectedHotelChain,
          HotelRatingId: selectedHotelRating,
        };
      }

      await axios.put(`/${path}/${id}`, updatedInfo);
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
          message = "Элемент успешно отредактирован!";
      }
      alert(message);
      navigate(`/${path}`);
    }
  }, [success, navigate, path]);

  useEffect(() => {
    if (info.photos) {
      setFiles(
        info.photos.map((photo) => ({
          url: photo,
          name: photo.substring(photo.lastIndexOf("/") + 1),
        }))
      );
    }
  }, [info.photos]);

  const { data, loading, error } = useFetch(`/${path}/${id}`);

  const { City, HotelChain, HotelRating } = data;

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="left">
          {files.map((file, index) => (
            <img key={index} src={file.url} alt={`image-${index}`} />
          ))}
          <div className="formInput">
            <label htmlFor="file">
              Image: <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFiles([...e.target.files])}
              style={{ display: "none" }}
              multiple
            />
          </div>
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
                  value={info[input.id]}
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
                <option value="">{City}</option>
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
                <option value="">{HotelChain}</option>
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
                <option value="">{HotelRating}</option>
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

export default EditHotel;
