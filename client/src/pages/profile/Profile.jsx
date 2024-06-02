import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../components/navbar/Logo";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import EditProfileForm from "./EditForm/EditProfileForm";
import BookingList from "./BookingList/BookingList";
import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo/UserInfo";
import "./profile.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const handleGoBack = () => {
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Вы уверены, что хотите удалить свой аккаунт?")) {
      try {
        await axios.delete(`/users/${id}`);
        alert("Аккаунт успешно удален");
        dispatch({ type: "LOGOUT" });
        navigate("/");
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
      }
    }
  };

  return (
    <div className="container">
      <Logo />
      <div className="profile-header">
        <h1>Профиль</h1>
      </div>
      <div className="button-div">
        <button className="button back-button" onClick={handleGoBack}>
          Назад
        </button>
      </div>
      <div className="button-div">
        <button
          className={`button ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Моя информация
        </button>
        <button
          className={`button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Мои бронирования
        </button>
      </div>
      <div className="profile-content">
        {activeTab === "info" ? (
          <>
            {editMode ? (
              <EditProfileForm setEditMode={setEditMode} />
            ) : (
              <>
                <UserInfo />
                <br />
                <button className="button" onClick={() => setEditMode(true)}>
                  Редактировать профиль
                </button>
                <button
                  className="button delete-button"
                  onClick={handleDeleteAccount}
                >
                  Удалить аккаунт
                </button>
              </>
            )}
          </>
        ) : (
          <BookingList />
        )}
      </div>
      <MailList />
      <Footer />
    </div>
  );
}

export default ProfilePage;
