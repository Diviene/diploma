import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SingleUser = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/users/${id}`);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No user data found.</div>;
  }

  var originalDate = data.DateOfBirth;

  var dateObj = new Date(originalDate);

  var day = dateObj.getUTCDate();
  var month = dateObj.getUTCMonth() + 1;
  var year = dateObj.getUTCFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  var formattedDate = day + "." + month + "." + year;

  console.log(data.CustomerGender);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация о пользователе</h1>
              <Link to="/users" className="backButton">
                Назад к списку пользователей
              </Link>
            </div>
            <div className="item">
              <img src={data.img} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{data.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">ФИО:</span>
                  <span className="itemValue">
                    {data.CustomerSurname +
                      " " +
                      data.CustomerName +
                      " " +
                      data.CustomerPatronymic}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Почта:</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Дата рождения:</span>
                  <span className="itemValue">{formattedDate}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Пол:</span>
                  <span className="itemValue">
                    {data.CustomerGender === true ? "Мужской" : "Женский"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Номер телефона:</span>
                  <span className="itemValue">{data.PhoneNumber}</span>
                </div>
                <div className="buttons">
                  <div className="buttonWrapper">
                    <button className="deleteButton">Удалить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
