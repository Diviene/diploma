import "./list.css";
import Navbar from "../../components/navbar/Logo";
import Header from "../../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { CityContext } from "../../context/CityContext";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { HotelContext } from "../../context/HotelContext";
import axios from "axios";
import { CSSTransition } from "react-transition-group";

const List = () => {
  const navigate = useNavigate();
  const { setHotelId } = useContext(HotelContext);
  const { cities } = useContext(CityContext);
  const location = useLocation();
  const [hotelChains, setHotelChains] = useState([]);
  const [hotelRatings, setHotelRatings] = useState([]);
  const [selectedHotelChain, setSelectedHotelChain] = useState("");
  const [selectedHotelRating, setSelectedHotelRating] = useState("");

  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const response = await axios.get("/hotelchains");
        setHotelChains(response.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    const fetchHotelRatings = async () => {
      try {
        const response = await axios.get("/hotelratings");
        setHotelRatings(response.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchHotelChains();
    fetchHotelRatings();
  }, []);

  const handleHotelRatingChange = (e) => {
    setSelectedHotelRating(e.target.value);
  };

  const handleHotelChainChange = (e) => {
    setSelectedHotelChain(e.target.value);
  };

  const storedDatesString = localStorage.getItem("dates");

  const handleDateChange = (selectedDates) => {
    setDates([selectedDates.selection]);
    localStorage.setItem("dates", JSON.stringify([selectedDates.selection]));
  };

  let storedDates;
  try {
    storedDates = JSON.parse(storedDatesString);
  } catch (error) {}

  const parsedDates = storedDates.map((date) => ({
    ...date,
    startDate: parseISO(date.startDate),
    endDate: parseISO(date.endDate),
  }));

  const [dates, setDates] = useState(parsedDates || location.state.dates);

  const storedDestination = localStorage.getItem("destination");
  const storedOptions = JSON.parse(localStorage.getItem("options"));

  const [destination, setDestination] = useState(
    storedDestination || location.state.destination
  );
  const [openDate, setOpenDate] = useState(false);

  const { data, loading, error, reFetch, options, setOptions } = useFetch(
    `/hotels/hotelbyParams?CityId=${destination}&HotelChainId=${selectedHotelChain}&HotelRatingId=${selectedHotelRating}`
  );

  useEffect(() => {
    reFetch();
  }, [destination, hotelChains, hotelRatings]);

  const handleClick = () => {
    reFetch();
  };

  const handleResetFilters = () => {
    setSelectedHotelChain("");
    setSelectedHotelRating("");
  };

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem("destination", destination);
  }, [destination]);

  const city = cities.find((city) => city._id === destination);
  const cityName = city ? city.name : "";

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Поиск</h1>
            <div className="lsItem">
              <label>Город</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="" disabled>
                  Select a destination
                </option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lsItem">
              <label>Диапазон дат</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {" "}
                с{" "}
                {`${format(dates[0].startDate, "dd.MM.yyyy")} до ${format(
                  dates[0].endDate,
                  "dd.MM.yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={handleDateChange}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Опции</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Кол-во зрослых</span>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    value={options.adult}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (newValue <= 4) {
                        setOptions((prevOptions) => ({
                          ...prevOptions,
                          adult: newValue,
                        }));
                      } else {
                        alert("Максимальное значение - 4");
                        setOptions((prevOptions) => ({
                          ...prevOptions,
                          adult: "",
                        }));
                      }
                    }}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Кол-во детей</span>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    className="lsOptionInput"
                    placeholder={options.children}
                    value={options.children}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (newValue <= 4) {
                        setOptions((prevOptions) => ({
                          ...prevOptions,
                          children: newValue,
                        }));
                      } else {
                        alert("Максимальное значение - 4");
                        setOptions((prevOptions) => ({
                          ...prevOptions,
                          children: "",
                        }));
                      }
                    }}
                  />
                </div>
                <div className="lsItem">
                  <label>Сеть отелей</label>
                  <select
                    value={selectedHotelChain}
                    onChange={handleHotelChainChange}
                  >
                    <option value="" disabled>
                      Сеть отелей
                    </option>
                    {hotelChains.map((chain) => (
                      <option key={chain._id} value={chain._id}>
                        {chain.HotelChainName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lsItem">
                  <label>Рейтинг отеля</label>
                  <select
                    value={selectedHotelRating}
                    onChange={handleHotelRatingChange}
                  >
                    <option value="" disabled>
                      Рейтинг отеля
                    </option>
                    {hotelRatings.map((rating) => (
                      <option key={rating._id} value={rating._id}>
                        {rating.HotelRatingStars}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="resetButton" onClick={handleResetFilters}>
                Сбросить фильтры
              </button>
            </div>
            <button onClick={handleClick}>Поиск</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Загрузка, пожалуйста подождите"
            ) : (
              <>
                {data.length === 0 ? (
                  <p>Ничего не найдено</p>
                ) : (
                  data.map((item) => (
                    <SearchItem
                      item={item}
                      key={item._id}
                      handleCheckAvailability={() => {
                        setHotelId(item._id);
                        navigate(`/hotels/${item._id}`);
                      }}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="homeContainer">
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default List;
