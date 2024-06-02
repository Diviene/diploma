import "./searchItem.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/HotelContext";
import firststar from "../../img/stars/firststar.png";
import second from "../../img/stars/second.png";
import third from "../../img/stars/third.png";
import forth from "../../img/stars/forth.png";
import fifth from "../../img/stars/fifth.png";
import { CSSTransition } from "react-transition-group";

const SearchItem = ({ item }) => {
  const navigate = useNavigate();
  const { setHotelId } = useContext(HotelContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const storedDates = localStorage.getItem("dates");
  const storedOptions = localStorage.getItem("options");

  const dates = JSON.parse(storedDates);
  const options = JSON.parse(storedOptions);

  console.log(dates, options);

  const handleCheckAvailability = () => {
    setHotelId(item._id);
    navigate(`/hotels/${item._id}`);
  };

  const getRatingImage = (rating) => {
    switch (rating) {
      case 1:
        return firststar;
      case 2:
        return second;
      case 3:
        return third;
      case 4:
        return forth;
      case 5:
        return fifth;
      default:
        return null;
    }
  };

  return (
    <CSSTransition in={true} appear={true} timeout={1000} classNames="fade">
      <div className={`searchItem ${isVisible ? "show" : ""}`}>
        <img src={item.photos[0]} alt="" className="siImg" />
        <div className="siDesc">
          <h1 className="siTitle">{item.HotelName}</h1>
          <span className="siAddress">
            {item.HotelAddress}, {item.City}, {item.HotelPostcode}
          </span>
          <span className="siDistance">{item.distance}</span>
          <span className="siFeatures">{item.HotelDescription}</span>
          <span className="siChain">Сеть отелей: {item.HotelChain}</span>
        </div>
        <div className="siDetails">
          <div className="siRating">
            <img
              src={getRatingImage(item.HotelRating)}
              alt={`${item.HotelRating} stars`}
              className="siRatingImg"
            />
          </div>
          <div className="siDetailTexts">
            <button className="siCheckButton" onClick={handleCheckAvailability}>
              Перейти к отелю
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SearchItem;
