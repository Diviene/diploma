import React, { useContext, useEffect, useState } from "react";
import "./reserve.css";
import {
  faCircleXmark,
  faTimes,
  faCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../slider/ImageSlider";
import { CSSTransition } from "react-transition-group";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [hotelRoomTypes, setHotelRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [sliderPhotos, setSliderPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 3;
  const [roomBookings, setRoomBookings] = useState({});
  const storedDates = JSON.parse(localStorage.getItem("dates"));
  const startDate = new Date(storedDates[0].startDate);
  const endDate = new Date(storedDates[0].endDate);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [roomDetails, setRoomDetails] = useState([]);
  const [roomPrices, setRoomPrices] = useState([]);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);

  const formattedStartDate = startDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    const fetchHotelRoomTypes = async () => {
      try {
        const response = await axios.get(
          `/hotelroomtypes/getRoomType/${hotelId}`
        );
        setHotelRoomTypes(response.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchHotelRoomTypes();
  }, [hotelId]);

  const Backdrop = ({ onClick }) => (
    <div className="backdrop" onClick={onClick}></div>
  );

  useEffect(() => {
    const fetchHotelRooms = async () => {
      try {
        const response = await axios.get(
          `/hotelrooms/getByHotel/${hotelId}${
            selectedRoomType ? `?HotelRoomTypeId=${selectedRoomType}` : ""
          }`
        );
        setSelectedRooms(response.data);
        const bookingsPromises = response.data.map(async (room) => {
          const bookingResponse = await axios.get(
            `/bookings/getByRoom/${room._id}`
          );
          return { roomId: room._id, bookings: bookingResponse.data };
        });
        const roomBookingsData = await Promise.all(bookingsPromises);
        const roomBookingsMap = {};
        roomBookingsData.forEach(({ roomId, bookings }) => {
          roomBookingsMap[roomId] = bookings;
        });
        setRoomBookings(roomBookingsMap);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchHotelRooms();
  }, [hotelId, selectedRoomType]);

  const handleImageClick = (photos) => {
    setSliderPhotos(photos);
    setIsSliderOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRoomType]);

  const navigate = useNavigate();

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = selectedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBooking = (roomId) => {
    if (selectedRoomIds.length < 4) {
      if (selectedRoomIds.includes(roomId)) {
        setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
      } else {
        setSelectedRoomIds([...selectedRoomIds, roomId]);
      }
    } else {
      if (selectedRoomIds.includes(roomId)) {
        setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
      } else {
        alert(
          "Вы уже выбрали максимальное количество комнат для бронирования (4)."
        );
      }
    }
  };

  const dateDiffInMilliseconds = endDate.getTime() - startDate.getTime();
  const dateDiffInSeconds = dateDiffInMilliseconds / 1000;
  const dateDiffInMinutes = dateDiffInSeconds / 60;
  const dateDiffInHours = dateDiffInMinutes / 60;
  const dateDiffInDays = dateDiffInHours / 24;

  const diffInDays = Math.floor(dateDiffInDays);

  const isRoomSelected = (roomId) => {
    return selectedRoomIds.includes(roomId);
  };

  const isRoomBooked = (roomId) => {
    const bookings = roomBookings[roomId] || [];
    return bookings.some((booking) => {
      const bookingStartDate = new Date(booking.DateOfStart);
      const bookingEndDate = new Date(booking.DateOfEnd);
      return (
        (startDate >= bookingStartDate && startDate <= bookingEndDate) ||
        (endDate >= bookingStartDate && endDate <= bookingEndDate) ||
        (bookingStartDate >= startDate && bookingEndDate <= endDate)
      );
    });
  };

  const handleClickBooking = () => {
    if (selectedRoomIds.length === 0) {
      alert("Выберите хотя бы одну комнату.");
    } else {
      setIsModalOpen(true);
    }
  };

  const ModalCloseButton = ({ onClick }) => (
    <FontAwesomeIcon
      icon={faCircleXmark}
      className="modalClose"
      onClick={onClick}
    />
  );

  useEffect(() => {
    const options = JSON.parse(localStorage.getItem("options"));
    if (options) {
      setAdult(options.adult);
      setChildren(options.children);
    }
  }, []);

  const fetchRoomPrices = async (selectedRoomIds) => {
    try {
      const response = await axios.post("/hotelrooms/postPriceForRoom", {
        selectedRoomIds,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении цен на комнаты:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prices = await fetchRoomPrices(selectedRoomIds);
        setRoomPrices(prices);
      } catch (error) {
        console.error("Ошибка при получении цен на комнаты:", error);
      }
    };

    if (selectedRoomIds.length > 0 || selectedRoomIds.length === 0) {
      fetchData();
    }
  }, [selectedRoomIds]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedRoomIds.forEach((roomId) => {
      const roomPrice = roomPrices.find((room) => room.roomId === roomId);
      if (roomPrice) {
        totalPrice +=
          (roomPrice.priceForAdult * adult +
            roomPrice.priceForChild * children) *
          diffInDays;
      }
    });

    return totalPrice;
  };

  const totalPrice = calculateTotalPrice();

  const handleBookingCreate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedDates = JSON.parse(localStorage.getItem("dates"));
    const startDate = new Date(storedDates[0].startDate);
    const endDate = new Date(storedDates[0].endDate);
    const storedOptions = JSON.parse(localStorage.getItem("options"));
    const { adult, children } = storedOptions;
    const selectedRoomId = [...selectedRoomIds];

    const bookingData = {
      DateOfStart: startDate,
      DateOfEnd: endDate,
      NumberOfAdults: adult,
      NumberOfChildren: children,
      FullPrice: totalPrice,
      Status: "",
      UserId: user._id,
      HotelRoomIds: selectedRoomId,
    };

    try {
      const response = await axios.post("/bookings", bookingData);
      console.log("Бронирование успешно создано:", response.data);
      alert("Успешно забронировано, информация о бронировании у вас в профиле");

      navigate("/");
    } catch (error) {
      console.error("Ошибка при создании бронирования:", error);
    }
  };

  console.log(selectedRoomIds);
  return (
    <CSSTransition in={true} appear={true} timeout={500} classNames="fade">
      <div className="reserve">
        <div className="rContainer">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
          />

          <div className="rFilter">
            <label>Фильтр по типу комнат: </label>
            <select
              className="selectContainer"
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
            >
              <option value=""></option>
              {hotelRoomTypes.map((roomType) => (
                <option key={roomType._id} value={roomType._id}>
                  {roomType.Name}
                </option>
              ))}
            </select>
          </div>
          {currentRooms.map((room) => {
            const booked = isRoomBooked(room._id);
            const isSelected = isRoomSelected(room._id);
            const isHovered = isSelected && hoveredRoomId === room._id;

            return (
              <div
                className={"rItem" + (booked ? " bookedItem" : "")}
                key={room._id}
              >
                <div className="rItemInfo">
                  <div>Номер комнаты: {room.HotelRoomNumber}</div>
                  <div className="rTitle">
                    Тип комнаты: {room.HotelRoomType}
                  </div>
                  <div className="rDesc">
                    {room.photos.slice(0, 2).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Room Photo ${index + 1}`}
                        className="rImg"
                        onClick={() => handleImageClick(room.photos)}
                      />
                    ))}
                  </div>
                </div>
                <div className="rItemActions">
                  <button
                    className={isSelected ? "bookedButton" : "bookingButton"}
                    onClick={() => handleBooking(room._id)}
                    style={{
                      backgroundColor: booked
                        ? "grey"
                        : isSelected
                        ? isHovered
                          ? "red"
                          : "green"
                        : "",
                    }}
                    disabled={booked}
                    onMouseEnter={() => setHoveredRoomId(room._id)}
                    onMouseLeave={() => setHoveredRoomId(null)}
                  >
                    {isSelected ? (
                      <FontAwesomeIcon icon={isHovered ? faTimes : faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faPlus} />
                    )}
                  </button>
                  <div className="tooltip">
                    Комнаты, помеченные серым цветом недоступны для бронирования
                    на указанные даты.
                  </div>
                </div>
              </div>
            );
          })}
          <button className="bookButton" onClick={handleClickBooking}>
            Бронировать
          </button>

          {isModalOpen && (
            <>
              <Backdrop onClick={() => setIsModalOpen(false)} />
              <div className="modal">
                <ModalCloseButton onClick={() => setIsModalOpen(false)} />{" "}
                <div className="modalTitle">
                  Информация о вашем бронировании
                </div>
                <div className="hotelName">
                  Отель: {roomPrices[0].hotelName}
                </div>
                <div className="bookingInfo">
                  <div className="bookingInfoItem">
                    <div className="bookingInfoLabel">
                      📅 Дата заезда: {formattedStartDate}
                    </div>
                  </div>
                  <div className="bookingInfoItem">
                    <div className="bookingInfoLabel">
                      📅 Дата выезда: {formattedEndDate}
                    </div>
                  </div>
                  <div className="bookingInfoItem">
                    <div className="bookingInfoLabel">
                      👨‍👩‍👦 Количество взрослых: {adult}
                    </div>
                  </div>
                  <div className="bookingInfoItem">
                    <div className="bookingInfoLabel">
                      🧒 Количество детей: {children}
                    </div>
                  </div>
                </div>
                <div className="modalTitle">Выбранные комнаты</div>
                {roomPrices.map((room) => (
                  <div key={room._id} className="roomCard">
                    <div className="roomCardTitle">
                      Комната {room.roomNumber}
                    </div>
                    <div className="roomInfo">
                      <div>
                        <span className="roomInfoLabel">Тип комнаты:</span>{" "}
                        {room.hotelRoomTypeName}
                      </div>
                      <div>
                        <span className="roomInfoLabel">
                          Цена за взрослого:
                        </span>{" "}
                        {room.priceForAdult} р.
                      </div>
                      <div>
                        <span className="roomInfoLabel">Цена за ребенка:</span>{" "}
                        {room.priceForChild} р.
                      </div>
                    </div>
                  </div>
                ))}
                <div className="totalPrice">Общая цена: {totalPrice} руб.</div>
                <br />
                <div>
                  <button className="bookButton" onClick={handleBookingCreate}>
                    Бронировать
                  </button>
                </div>
              </div>
            </>
          )}
          {selectedRooms.length > roomsPerPage && (
            <ul className="pagination">
              {Array.from({
                length: Math.ceil(selectedRooms.length / roomsPerPage),
              }).map((_, index) => (
                <li key={index} className="page-item">
                  <button
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ImageSlider
          photos={sliderPhotos}
          isOpen={isSliderOpen}
          onClose={() => setIsSliderOpen(false)}
        />
      </div>
    </CSSTransition>
  );
};

export default Reserve;
