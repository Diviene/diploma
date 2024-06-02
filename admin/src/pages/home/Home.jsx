import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import "./home.scss";
import { useContext } from "react";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <div className="welcomeMessage">Добро пожаловать, {user.username}</div>
        <div className="charts"></div>
        <div className="listContainer">
          <div className="listTitle">
            Выберите таблицу с информацией для редактирования
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
