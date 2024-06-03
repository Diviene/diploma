import { useContext } from "react";
import "./logo.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo1 from "../../img/logo1.png";

const Logo = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="logo-container">
            <img src={logo1} className="image1" alt="Logo" />
          </div>
        </Link>
        <div className="navItems">
          {user && user !== null ? (
            <>
              <span style={{ marginRight: "10px" }}>
                Добрый день, {user.username}!
              </span>
              <Link
                to={`/profile/${user._id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <button className="navButton">Ваш профиль</button>
              </Link>
              <button className="navButton" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </>
          ) : (
            <>
              <span style={{ marginRight: "10px" }}>
                Зарегистрируйтесь прямо сейчас! - {">"}
              </span>
              <Link to="/register">
                <button className="navButton">Регистрация</button>
              </Link>
              <Link to="/login">
                <button className="navButton">Авторизация</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
