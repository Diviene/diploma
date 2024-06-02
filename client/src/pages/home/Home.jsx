import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import HomeFullment from "../../components/homeFullment/HomeFullment";
import MailList from "../../components/mailList/MailList";
import Logo from "../../components/navbar/Logo";
import "./home.css";
import { CSSTransition } from "react-transition-group";

const Home = () => {
  return (
    <CSSTransition in={true} appear={true} timeout={1000} classNames="fade">
      <div>
        <Logo />
        <Header />
        <div className="homeContainer">
          <HomeFullment />
          <MailList />
          <Footer />
        </div>
      </div>
    </CSSTransition>
  );
};

export default Home;
