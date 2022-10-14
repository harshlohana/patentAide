import React from "react";
import { useHistory } from "react-router-dom";
import "./AppFooter.css";

function ApplicationFooter() {
  const history = useHistory();

  const ShowAboutUs = () => {
    history.push("/about-us");
  };
  const ShowHome = () => {
    history.push("/");
  };
  const ShowContactUs = () => {
    history.push("/contact-us");
  };
  const ShowLoginPage = () => {
    history.push("/login");
  };
  return (
    <>
      <footer>
        <br />
        <p class="copyright">&copy; Copyright 2021 | Patent Aide</p>
      </footer>
    </>
  );
}

export default ApplicationFooter;
