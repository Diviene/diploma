import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SingleCity = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/${path}/${id}`);

  console.log(data);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="header">
              <h1 className="title">Информация</h1>
              <Link to="/cities" className="backButton">
                Назад к списку городов
              </Link>
            </div>
            <div className="details">
              <h1 className="itemTitle">Наименование: {data.name}</h1>
              <div className="detailItem">
                <div className="buttons">
                  <div className="buttonWrapper">
                    <Link to={`/${path}/${id}/edit`}>
                      <button className="editButton">Редактировать</button>
                    </Link>
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

export default SingleCity;
