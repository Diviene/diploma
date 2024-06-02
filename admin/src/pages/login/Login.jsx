import { useContext, useState } from "react";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";
import { useAsyncError, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../img/logo.png";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { data, loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      if (res.data.IsAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

        navigate("/");
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "Доступ запрещен!" },
        });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div class="backgroundcolor">
      <div class="centered">
        <h6>(Панель администратора)</h6>
        <div class="logo-container">
          <img src={logo} className="image1" />
        </div>
        <h1>Авторизация</h1>
        <form method="">
          <div class="txt_fielded">
            <input type="text" id="username" onChange={handleChange} required />
            <span></span>
            <label>Логин</label>
          </div>
          <div class="txt_fielded">
            <input
              type="password"
              class="usernameinput"
              id="password"
              onChange={handleChange}
              required
            />
            <span></span>
            <label>Пароль</label>
          </div>
          <div>
            <button
              disabled={loading}
              onClick={handleClick}
              className="loginbth"
            >
              Авторизация
            </button>
          </div>
          <div className="error-message">
            {error && <span>{error.message}</span>}
          </div>
          <div class="pass">Забыли пароль?</div>
          <div class="signup_link">
            Еще не зарегистрированы? <a href="#">Регистрация</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
