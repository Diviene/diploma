import React, { useState } from "react";
import axios from "axios";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ForgotPassword = () => {
  const { user } = useContext(AuthContext);
  const userId = user ? user._id : "";
  const [inputType, setInputType] = useState("username");
  const [inputValue, setInputValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const navigate = useNavigate();

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
    setInputValue("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccessMessage("");
    setErrorMessage("");
    setIsCodeSent(false);
    setIsCodeVerified(false);
  };

  const handleInputValueChange = (e) => {
    setInputValue(e.target.value);
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccessMessage("");
    setErrorMessage("");
    setIsCodeSent(false);
    setIsCodeVerified(false);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/sendCodeByEmail", {
        [inputType]: inputValue,
      });
      if (response.status === 200) {
        setSuccessMessage("Письмо для сброса пароля отправлено на ваш email.");
        setIsCodeSent(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Ошибка при отправке запроса.");
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/verifyCode", {
        [inputType]: inputValue,
        code: verificationCode,
      });
      setSuccessMessage("Код подтвержден. Вы можете сбросить пароль.");
      setIsCodeVerified(true);
    } catch (error) {
      setErrorMessage("Неверный код подтверждения.");
    }
  };

  const handleBackButtonClick = () => {
    if (user) {
      navigate(`/profile/${userId}`);
    } else {
      navigate("/login");
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Пароли не совпадают.");
      return;
    }
    try {
      const response = await axios.post("/auth/changePassword", {
        [inputType]: inputValue,
        newPassword: newPassword,
      });
      if (response.status === 200) {
        setSuccessMessage("Пароль успешно изменен.");
        setErrorMessage("");
        setTimeout(() => {
          if (user) {
            navigate(`/profile/${userId}`);
          } else {
            navigate("/login");
          }
        }, 2000);
      } else {
        setErrorMessage("Ошибка при изменении пароля.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Ошибка при изменении пароля.");
      }
    }
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleEnterAnother = () => {
    setInputValue("");
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setSuccessMessage("");
  };
  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Забыли пароль?</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {!isCodeSent && (
        <form onSubmit={handleSendCode} className="forgot-password-form">
          <div className="input-type-selector">
            <label>
              <input
                type="radio"
                value="username"
                checked={inputType === "username"}
                onChange={handleInputTypeChange}
              />
              Никнейм
            </label>
            <label>
              <input
                type="radio"
                value="email"
                checked={inputType === "email"}
                onChange={handleInputTypeChange}
              />
              Почта
            </label>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputValueChange}
            placeholder={`Введите ваш ${
              inputType === "username" ? "никнейм" : "почту"
            }`}
            className="forgot-password-input"
            required
          />
          <button type="submit" className="forgot-password-button">
            Отправить
          </button>
        </form>
      )}
      {isCodeSent && !isCodeVerified && (
        <form onSubmit={handleVerifyCode} className="forgot-password-form">
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            placeholder="Введите код"
            className="forgot-password-input"
            required
          />
          <button type="submit" className="forgot-password-button">
            Подтвердить
          </button>
        </form>
      )}
      {isCodeSent && isCodeVerified && (
        <div>
          <form
            onSubmit={handleChangePassword}
            className="forgot-password-form"
          >
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Введите новый пароль"
              className="forgot-password-input"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Повторите пароль"
              className="forgot-password-input"
              required
            />
            <button type="submit" className="forgot-password-button">
              Изменить пароль
            </button>
          </form>
        </div>
      )}
      <div className="back-button1">
        <button onClick={handleBackButtonClick}>Назад</button>
      </div>
      {isCodeSent && (
        <div className="enter-another-username">
          <button onClick={handleEnterAnother}>
            Ввести{" "}
            {inputType === "username" ? "другой никнейм" : "другую почту"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
