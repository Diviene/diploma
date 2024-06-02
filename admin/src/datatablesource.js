export const userColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Никнейм",
      width: 230,
    },
    {
        field: "email",
        headerName: "Почта",
        width: 230,
    },
    {
      field: "CustomerSurname",
      headerName: "Фамилия",
      width: 100,
    },
    {
    field: "CustomerName",
    headerName: "Имя",
    width: 100,
    },
    {
    field: "CustomerPatronymic",
    headerName: "Отчество",
    width: 100,
    },
    {
      field: "PhoneNumber",
      headerName: "Номер телефона",
      width: 100,
    },
    {
        field: "img",
        headerName: "Фотография",
        width: 230,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img className="cellImg" src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
              {params.row.username}
            </div>
          );
        },
      },
  ];

  export const cityColumns = [
    {
      field: "name",
      headerName: "Наименование города",
      width: 230,
    }
  ];

  export const hotelChainColumns = [
    {
      field: "HotelChainName",
      headerName: "Наименование сети отелей",
      width: 230,
    }
  ];

  export const hotel = [
    {
      field: "HotelName",
      headerName: "Название отеля",
      width: 230,
    },
    {
      field: "HotelAddress",
      headerName: "Адрес отеля",
      width: 230,
    },
    {
      field: "HotelPostcode",
      headerName: "Почтовый индекс отеля",
      width: 230,
    },
    {
      field: "HotelDescription",
      headerName: "Описание отеля",
      width: 230,
    },
  ];

  export const hotelRoomTypeColumns = [
    {
      field: "Rating",
      headerName: "Рейтинг",
      width: 230,
    },
    {
      field: "Name",
      headerName: "Название типа комнаты",
      width: 230,
    },
    {
      field: "PriceForAdult",
      headerName: "Цена за взрослого (в руб.)",
      width: 230,
    },
    {
      field: "PriceForChild",
      headerName: "Цена за ребенка (в руб.)",
      width: 230,
    },
  ];

  export const hotelRoomColumns = [
    {
      field: "HotelRoomNumber",
      headerName: "Номер комнаты",
      width: 230,
    },
  ];

  export const bookingColumns = [
    {
      field: "DateOfStart",
      headerName: "Дата начала",
      width: 230,
    },
    {
      field: "DateOfEnd",
      headerName: "Дата окончания",
      width: 230,
    },
    {
      field: "NumberOfAdults",
      headerName: "Количество взрослых",
      width: 230,
    },
    {
      field: "NumberOfChildren",
      headerName: "Количество детей",
      width: 230,
    },
    {
      field: "FullPrice",
      headerName: "Полная стоимость",
      width: 230,
    },
  ];

  export const hotelRatingColumns = [
    {
      field: "HotelRatingStars",
      headerName: "Количество звезд отеля",
      width: 230,
    },
    {
        field: "photo",
        headerName: "Картинка",
        width: 230,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img className="cellImg" src={params.row.photo || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
            </div>
          );
        },
      },
  ];