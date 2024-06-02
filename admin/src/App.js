import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from 'react-router-dom';
import Home from "./pages/home/Home"
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import {bookingColumns, cityColumns, hotel, hotelChainColumns, hotelRatingColumns, hotelRoomColumns, hotelRoomTypeColumns, userColumns} from "./datatablesource.js";
import { bookingInputs, cityInputs, hotelChainInputs, hotelInputs, hotelRatingInfo, hotelRatingInputs, hotelRoomInputs, hotelRoomTypeInputs } from "./formSource.js";
import NewProperty from "./pages/new/NewNoKeyProperty/NewProperty.jsx";
import SingleUser from "./pages/single/SingleUser.jsx";
import SingleCity from "./pages/single/SingleCity.jsx";
import SingleHotelChain from "./pages/single/SingleHotelChain.jsx";
import SingleHotelRating from "./pages/single/SingleHotelRating.jsx";
import SingleHotel from "./pages/single/SingleHotel.jsx";
import NewHotelRoomType from "./pages/new/newKeyProperty/NewHotelRoomType.jsx";
import NewHotel from "./pages/new/newKeyProperty/NewHotel.jsx";
import SingleHotelRoomType from "./pages/single/SingleHotelRoomType.jsx";
import NewHotelRoom from "./pages/new/newKeyProperty/NewHotelRoom.jsx";
import SingleHotelRoom from "./pages/single/SingleHotelRoom.jsx";
import SingleBooking from "./pages/single/SingleBooking.jsx";
import EditProperty from "./pages/edit/editNoKeyProperty/EditProperty.jsx";
import EditHotel from "./pages/edit/editKeyProperty/EditHotel.jsx";
import EditHotelRoomType from "./pages/edit/editKeyProperty/EditHotelRoomType.jsx";
import EditHotelRoom from "./pages/edit/editKeyProperty/EditHotelRoom.jsx";

function App() {

  const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext)

    if(!user) {
      return <Navigate to="/login"/>
    }
    return children;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            /> 
          </Route>
          <Route path="users">
              <Route index element={<ProtectedRoute><List columns={userColumns}/></ProtectedRoute>} />
              <Route path=":userId" element={<ProtectedRoute><SingleUser /></ProtectedRoute>} />
              <Route disabled
                path="new"
              />
            </Route>
            <Route path="cities">
              <Route index element={<ProtectedRoute><List columns={cityColumns}/></ProtectedRoute>} />
              <Route path=":cityId" element={<ProtectedRoute><SingleCity /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewProperty inputs={cityInputs} title="Добавить город" /></ProtectedRoute>}/>
                <Route path=":cityId/edit" element={<ProtectedRoute><EditProperty inputs={cityInputs} title="Редактирование города" /></ProtectedRoute>} />
            </Route> 
            <Route path="hotelchains">
              <Route index element={<ProtectedRoute><List columns={hotelChainColumns}/></ProtectedRoute>} />
              <Route path=":hotelchainid" element={<ProtectedRoute><SingleHotelChain /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewProperty inputs={hotelChainInputs} title="Добавить сеть отелей" /></ProtectedRoute>}
              />
              <Route path=":hotelchainid/edit" element={<ProtectedRoute><EditProperty inputs={hotelChainInputs} title="Редактирование сети отелей" /></ProtectedRoute>} />
            </Route> 
            <Route path="hotelratings">
              <Route index element={<ProtectedRoute><List columns={hotelRatingColumns}/></ProtectedRoute>} />
              <Route path=":hotelratingid" element={<ProtectedRoute><SingleHotelRating title="Рейтинг" /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewProperty inputs={hotelRatingInputs} title="Добавить рейтинг" /></ProtectedRoute>}
              />
              <Route path=":hotelchainid/edit" element={<ProtectedRoute><EditProperty inputs={hotelRatingInputs} title="Редактирование рейтинга" /></ProtectedRoute>} />
            </Route> 
            <Route path="hotels">
              <Route index element={<ProtectedRoute><List columns={hotel}/></ProtectedRoute>} />
              <Route path=":hotelid" element={<ProtectedRoute><SingleHotel title="Отель" /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewHotel inputs={hotelInputs} title="Добавить отель" /></ProtectedRoute>}
              />
              <Route path=":hotelid/edit" element={<ProtectedRoute><EditHotel inputs={hotelInputs} title="Редактирование отеля" /></ProtectedRoute>} />
            </Route> 
            <Route path="hotelroomtypes">
              <Route index element={<ProtectedRoute><List columns={hotelRoomTypeColumns}/></ProtectedRoute>} />
              <Route path=":hotelroomtypeid" element={<ProtectedRoute><SingleHotelRoomType title="Тип комнат" /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewHotelRoomType inputs={hotelRoomTypeInputs} title="Добавить тип комнат" /></ProtectedRoute>}
              />
              <Route path=":hotelroomtypeid/edit" element={<ProtectedRoute><EditHotelRoomType inputs={hotelRoomTypeInputs} title="Редактирование типа комнаты" /></ProtectedRoute>} />
            </Route>
            <Route path="hotelrooms">
              <Route index element={<ProtectedRoute><List columns={hotelRoomColumns}/></ProtectedRoute>} />
              <Route path=":hotelroomid" element={<ProtectedRoute><SingleHotelRoom title="Комнаты" /></ProtectedRoute>} />
              <Route
                path="new"
                element={<ProtectedRoute><NewHotelRoom inputs={hotelRoomInputs} title="Добавить комнаты" /></ProtectedRoute>}
              />
              <Route path=":hotelroomid/edit" element={<ProtectedRoute><EditHotelRoom inputs={hotelRoomInputs} title="Редактирование комнаты" /></ProtectedRoute>} />
            </Route> 
            <Route path="bookings">
              <Route index element={<ProtectedRoute><List columns={bookingColumns}/></ProtectedRoute>} />
              <Route path=":bookingid" element={<ProtectedRoute><SingleBooking title="Бронирования" /></ProtectedRoute>} />
            </Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
