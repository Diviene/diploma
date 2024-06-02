import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useContext, useEffect, useState, useRef } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ru } from "date-fns/locale";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [cities, setCities] = useState([]);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const dateRangeRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const storedOptions = JSON.parse(localStorage.getItem("options"));
    if (storedOptions) {
      setOptions(storedOptions);
    }
  }, []);

  useEffect(() => {
    const storedOptions = JSON.parse(localStorage.getItem("options"));
    if (storedOptions) {
      setOptions(storedOptions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    const storedDestination = localStorage.getItem("destination");
    if (storedDestination) {
      setDestination(storedDestination);
    }
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleDateChange = (selectedDates) => {
    setDates([selectedDates.selection]);
    localStorage.setItem("dates", JSON.stringify([selectedDates.selection]));
  };

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]:
          operation === "i"
            ? options[name] < 4
              ? options[name] + 1
              : options[name]
            : options[name] > (name === "adult" ? 1 : 0)
            ? options[name] - 1
            : options[name],
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    if (!destination) {
      alert("Выберите город");
      return;
    }

    const startDate = dates[0].startDate;
    const endDate = dates[0].endDate;

    const differenceInDays = Math.floor(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );
    if (differenceInDays === 0) {
      alert("Даты заезда и выезда одинаковы");
      return;
    }

    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate("/hotels", { state: { destination, dates, options } });
  };

  const handleDestinationChange = (e) => {
    const newDestination = e.target.value;
    setDestination(newDestination);
    localStorage.setItem("destination", newDestination);
  };

  const handleClickOutside = (event) => {
    if (
      dateRangeRef.current &&
      !dateRangeRef.current.contains(event.target) &&
      !openDate
    ) {
      setOpenDate(false);
    }

    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      !openOptions
    ) {
      setOpenOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {type !== "list" && (
          <>
            <div className="headerSearch">
              <div className="headerSearchItem headerSearchSelect">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <select
                  value={destination}
                  onChange={handleDestinationChange}
                  className="headerSearchInput"
                >
                  <option value="" disabled>
                    Куда собираетесь?
                  </option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} по ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <div className="optionss" ref={dateRangeRef}>
                    <DateRange
                      locale={ru}
                      editableDateInputs={true}
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      className="date"
                      minDate={new Date()}
                    />
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} взрослых · ${options.children} детей`}</span>
                {openOptions && (
                  <div className="options" ref={optionsRef}>
                    <div className="optionItem">
                      <span className="optionText">Взрослые</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          disabled={options.adult >= 4}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Дети</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          disabled={options.children >= 4}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Поиск
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
