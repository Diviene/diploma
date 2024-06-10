import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import ProfilePage from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import EditProfileForm from "./pages/profile/EditForm/EditProfileForm";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/profile/:userid" element={<ProfilePage/>}/>
        <Route path="/editprofile/:userid" element={<EditProfileForm/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
