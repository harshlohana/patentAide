// import react from 'react';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function ApplicationHomeNavBar() {
  const history = useHistory();

  const ScrollToSection = (id) => {
    const elem = document.getElementById(`${id}`);
    elem.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
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
  useEffect(()=>{
    if(window.location.hash){
      ScrollToSection(window.location.hash.split('#')[1])
    }
  },[window.location.hash])
  const ShowHome = (id) => {
    history.push(`/#${id}`);
    ScrollToSection(id)
  };
  const ShowLoginPage = () => {
    history.push("/login");
  };

  const navigationButtons = [
    {name: 'Contact', href:"contact", styleClass:'contactbtn'},
    {name: 'Pricing', href:"pricing", styleClass:'pricingbtn'},
    {name: 'Portfolio', href:"portfolio", styleClass:'portfoliobtn'},
    {name: 'Clients', href:"news", styleClass:'clientsbtn'},
    {name: 'About', href:"about", styleClass:'aboutbtn'},
    {name: 'Service', href:"services", styleClass:'servicesbtn'},
    {name: 'Home', href:"home", styleClass:'homebtn'},
  ]
  return (
    <>
      <nav className="navbar">
        <ul>
          <p class="logo">
            <img
              src="logo.png"
            />
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
            <>
            {navigationButtons.map((navigationButton)=>(
              <li>
              <button className={navigationButton.styleClass} onClick={()=>ShowHome(navigationButton.href)}>
                {/* <a href={navigationButton.href}> */}
                {navigationButton.name}
                {/* </a> */}
              </button>
            </li>
            ))}
            </>
            {/* <li>
              <button className="contactbtn">
                <a href="/#contact">Contact</a>
              </button>
            </li>
            <li>
              <button className="pricingbtn">
                Pricing
              </button>
            </li>
            <li>
              <button className="portfoliobtn">
                Portfolio
              </button>
            </li>
            <li>
              <button className="clientsbtn">
                Clients
              </button>
            </li>
            <li>
              <button className="aboutbtn">
                About
              </button>
            </li>
            <li>
              <button className="servicesbtn">
                Service
              </button>
            </li>
            <li>
              <button className="homebtn">
                Home
              </button>
            </li> */}
          </div>
        </ul>
      </nav>
    </>
  );
}

export default ApplicationHomeNavBar;
