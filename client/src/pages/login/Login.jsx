import { useContext, useEffect, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    dispatch({ type: "RESET_ERROR" });
  }, []);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate(redirectPath);
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className={`backgroundcolor ${isActive ? "active" : ""}`}>
      <div className={`logincentered ${isActive ? "active" : ""}`}>
        <div className="logo-container1">
          <Link to="/">
            <img src={logo} className="image1" alt="logo" />
          </Link>
        </div>
        <h1>Авторизация</h1>
        <form method="">
          <div className="txt_fielded">
            <input type="text" id="username" onChange={handleChange} required />
            <span></span>
            <label>Логин</label>
          </div>
          <div className="txt_fielded">
            <input
              type="password"
              className="usernameinput"
              id="password"
              onChange={handleChange}
              required
            />
            <span></span>
            <label>Пароль</label>
          </div>
        </form>
        <div className="form-actions">
          <div>
            <button
              disabled={loading}
              onClick={handleClick}
              className="loginbth"
            >
              Авторизация
            </button>
            {error && <span className="error-message">{error.message}</span>}
          </div>
          <div className="pass">
            <Link to="/forgotpassword">Забыли пароль?</Link>
          </div>
          <div className="signup_link">
            Еще не зарегистрированы? <Link to="/register">Регистрация</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
