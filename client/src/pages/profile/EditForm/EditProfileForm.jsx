import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import "./editProfile.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";

function EditProfileForm({ setEditMode }) {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { data, loading, reFetch } = useFetch(`/users/${id}`);

  useEffect(() => {
    if (!loading && data) {
      setFormData({
        username: data.username,
        email: data.email,
        CustomerSurname: data.CustomerSurname,
        CustomerName: data.CustomerName,
        CustomerPatronymic: data.CustomerPatronymic || "",
        DateOfBirth: data.DateOfBirth,
        CustomerGender: data.CustomerGender,
        PhoneNumber: data.PhoneNumber,
        img: data.img || "",
      });
    }
  }, [data, loading]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    CustomerSurname: "",
    CustomerName: "",
    CustomerPatronymic: "",
    DateOfBirth: "",
    CustomerGender: "",
    PhoneNumber: "",
    img: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = { ...formData };

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("file", imageFile);
        imageData.append("upload_preset", "upload");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dwvifh6bk/image/upload",
          imageData
        );

        const { url } = uploadRes.data;
        updatedData.img = url;
      }

      await axios.put(`/users/${id}`, updatedData);
      alert("Профиль успешно обновлен!");
      setEditMode(false);
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Произошла ошибка при обновлении профиля.");
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/users/deleteImage/${id}`);
      setFormData({ ...formData, img: "" });
    } catch (error) {
      console.error("Ошибка при удалении изображения:", error);
      setErrorMessage("Произошла ошибка при удалении изображения.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <div className="profile-title">
        <label>Редактирование профиля</label>
      </div>
      <div className="photoclass">
        <div className="lefts">
          <div className="image-container">
            <img
              key={formData.img}
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : formData.img ||
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
            {formData.img && (
              <button
                type="button"
                className="delete-image-btn"
                onClick={handleDeleteImage}
              >
                <div className="delete-icon">
                  <CloseIcon />
                </div>
              </button>
            )}
          </div>
          <div className="formInput">
            <label htmlFor="image">
              Изображение профиля:{" "}
              <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="username" className="label">
          Имя пользователя
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Имя пользователя"
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="label">
          Email
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="CustomerName" className="label">
          Имя
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="CustomerName"
            name="CustomerName"
            value={formData.CustomerName}
            onChange={handleChange}
            placeholder="Имя"
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="CustomerSurname" className="label">
          Фамилия
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="CustomerSurname"
            name="CustomerSurname"
            value={formData.CustomerSurname}
            onChange={handleChange}
            placeholder="Фамилия"
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="CustomerPatronymic" className="label">
          Отчество
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="CustomerPatronymic"
            name="CustomerPatronymic"
            value={formData.CustomerPatronymic}
            onChange={handleChange}
            placeholder="Отчество"
            className="input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="DateOfBirth" className="label">
          Дата рождения
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="DateOfBirth"
            name="DateOfBirth"
            value={formatDate(formData.DateOfBirth)}
            onChange={handleChange}
            placeholder="Дата рождения (дд.мм.гггг)"
            className="input"
            disabled
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="CustomerGender" className="label">
          Пол
        </label>
        <div className="input-wrapper">
          <select
            id="CustomerGender"
            name="CustomerGender"
            value={formData.CustomerGender}
            className="input"
            disabled
          >
            <option value="true">Мужской</option>
            <option value="false">Женский</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="PhoneNumber" className="label">
          Номер телефона
        </label>
        <div className="input-wrapper">
          <input
            type="tel"
            id="PhoneNumber"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            placeholder="Номер телефона"
            className="input"
          />
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit" className="btn-submit">
        Сохранить
      </button>
      <button type="button" onClick={handleCancel} className="btn-cancel">
        Отмена
      </button>
      <div className="forgot-password">
        <Link to="/forgotpassword">
          <button className="forgot-password-btn">Забыли пароль?</button>
        </Link>
      </div>
    </form>
  );
}

export default EditProfileForm;
