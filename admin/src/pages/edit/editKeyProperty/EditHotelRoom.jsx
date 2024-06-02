import "./edit.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const EditHotelRoom = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/hotelroomtypes");
        setHotels(response.data);
        const infoResponse = await axios.get(`/${path}/${id}`);
        setInfo(infoResponse.data);
        setSelectedHotel(infoResponse.data.HotelRoomTypeId);
        if (infoResponse.data.photos) {
          setFiles(
            infoResponse.data.photos.map((photo) => ({
              url: photo,
              name: photo.substring(photo.lastIndexOf("/") + 1),
            }))
          );
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };
    fetchData();
  }, [path, id]);

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
          HotelRoomTypeId: selectedHotel,
        };
      } else {
        updatedInfo = {
          ...updatedInfo,
          HotelRoomTypeId: selectedHotel,
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

  const { HotelRoomType } = data;

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
              <label htmlFor="hotelroomtype">Тип комнаты</label>
              <select
                id="hotelroomtype"
                onChange={handleHotelChange}
                value={selectedHotel}
              >
                <option value="">{HotelRoomType}</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.Name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleClick}>Сохранить изменения</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHotelRoom;
