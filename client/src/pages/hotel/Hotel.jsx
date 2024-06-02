import React, { useContext, useState } from "react";
import "./hotel.css";
import Logo from "../../components/navbar/Logo";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import ImageSliderModal from "../../components/slider/ImageSlider"; // Импортируем компонент ImageSliderModal
import firststar from "../../img/stars/firststar.png";
import second from "../../img/stars/second.png";
import third from "../../img/stars/third.png";
import forth from "../../img/stars/forth.png";
import fifth from "../../img/stars/fifth.png";
import { CSSTransition } from "react-transition-group";
import Reserve from "../../components/reserve/Reserve";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading } = useFetch(`/hotels/${id}`);
  const {
    HotelName,
    HotelAddress,
    HotelPostcode,
    HotelDescription,
    photos,
    City,
    HotelChain,
    HotelRating,
  } = data;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOpenSlider = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleCloseSlider = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  const handleGoBack = () => {
    const previousPage = localStorage.getItem("previousPage");
    navigate(
      previousPage && previousPage !== "/login" ? previousPage : "/hotels"
    );
  };

  const renderStarRating = () => {
    const stars = [firststar, second, third, forth, fifth];
    return (
      <img
        src={stars[HotelRating - 1]}
        alt={`${HotelRating} stars`}
        className="starRating"
      />
    );
  };

  return (
    <div>
      <Logo />
      <Header type="list" />
      <CSSTransition
        in={!loading}
        appear={true}
        timeout={1000}
        classNames="fade"
      >
        <div className="hotelContainer">
          <div className="hotelWrapper">
            <button className="backButton" onClick={handleGoBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Назад
            </button>
            {renderStarRating()}
            <h1 className="hotelTitle">{HotelName}</h1>
            <p className="hotelInfo">
              Город: {City}, Сеть отелей: {HotelChain}
            </p>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              &nbsp;
              <span>
                {HotelAddress}, {HotelPostcode}
              </span>
            </div>
            <div className="hotelImages">
              {photos &&
                photos.map((photo, i) => (
                  <div className="hotelImgWrapper" key={i}>
                    <img
                      onClick={() => handleOpenSlider(i)}
                      src={photo}
                      alt=""
                      className="hotelImg"
                    />
                  </div>
                ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle"> Наименование: {HotelName}</h1>
                <br />
                <p className="hotelDesc">Описание: {HotelDescription}</p>
              </div>
            </div>
            <button className="bookNow" onClick={handleOpenModal}>
              Забронируйте прямо сейчас!
            </button>
          </div>
        </div>
      </CSSTransition>
      <ImageSliderModal
        photos={photos}
        isOpen={open}
        onClose={handleCloseSlider}
      />
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
      <MailList />
      <Footer />
    </div>
  );
};

export default Hotel;
