import react from "react";
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
        <p className="copyright">&copy; Copyright 2022 | PatentAide</p>
      </footer>
    </>
  );
}

export default ApplicationFooter;
