// import react from 'react';
import { useHistory } from "react-router-dom";

function ApplicationHomeNavBar(props) {
  const history = useHistory();

  const ScrollToSection = (id) => {
    if (props.current === "loginPage") {
      history.push({ pathname: "/", id: id });
    } else {
      props.goToSection(id);
    }
  };

  window.addEventListener("load", () => {
    const navbar = document.querySelector(".navbar");
    const burger = document.querySelector(".burger");

    // Variable to check when is the burger icon clicked/touched
    let isBurger = false;
    const listElems = document.querySelectorAll(".navbar li");
    burger.addEventListener("click", function (e) {
      if (isBurger) {
        document.querySelector(".line1").style.transform = "none";
        document.querySelector(".line2").style.opacity = 1;
        document.querySelector(".line3").style.transform = "none";
        listElems.forEach(function (items) {
          items.style.transform = "translateY(-1000%)";
          items.style.transition = "transform 0.5s ease-in";
        });
        document.querySelector(".navbar ul .logo").style.color = "white";
        // document.querySelector('.burger div').style.backgroundColor = 'white';
        isBurger = false;
      } else {
        document.querySelector(".line1").style.transform =
          "rotate(-45deg) translate(0px, 20px)";
        document.querySelector(".line2").style.opacity = 0;
        document.querySelector(".line3").style.transform =
          "rotate(45deg) translate(5px, -10px)";
        listElems.forEach(function (items) {
          items.style.transform = "translateY(0%)";
          items.style.transition = "transform 0.5s ease-in";
        });
        document.querySelector(".navbar ul .logo").style.color = "white";

        // document.querySelector('.burger div').style.backgroundColor = 'black';
        isBurger = true;
      }
    });
  });
  const ShowHome = () => {
    history.push("/");
  };
  const ShowLoginPage = () => {
    history.push("/login");
  };
  return (
    <>
      <nav className="navbar">
        <ul>
          <p className="logo">
            <img src="logo.png" />
          </p>
          <div className="burger">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <div className="navbar-links">
            <li>
              <button className="signinbtn" onClick={ShowLoginPage}>
                Sign In
              </button>
            </li>
            <li>
              <button
                className="contactbtn"
                onClick={(e) => ScrollToSection("contact")}
              >
                Contact
              </button>
            </li>
            <li>
              <button
                className="pricingbtn"
                onClick={(e) => ScrollToSection("pricing")}
              >
                Pricing
              </button>
            </li>
            <li>
              <button
                className="portfoliobtn"
                onClick={(e) => ScrollToSection("portfolio")}
              >
                Portfolio
              </button>
            </li>
            {/* <li>
              <button className="clientsbtn" onClick={(e)=>ScrollToSection("")}>
                Clients
              </button>
            </li> */}
            <li>
              <button
                className="aboutbtn"
                onClick={(e) => ScrollToSection("about")}
              >
                About
              </button>
            </li>
            <li>
              <button
                className="servicesbtn"
                onClick={(e) => ScrollToSection("services")}
              >
                Service
              </button>
            </li>
            <li>
              <button
                className="homebtn"
                onClick={(e) => ScrollToSection("home")}
              >
                Home
              </button>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
}

export default ApplicationHomeNavBar;
