import react from 'react';
import { useHistory } from 'react-router-dom';


function ApplicationUserFooter() {

    const history = useHistory();

    const ShowAboutUs = () => {
        history.push('/about-us');
    }
    const ShowHome = () => {
        history.push('/');
    }
    const ShowContactUs = () => {
        history.push('/contact-us');
    }
    const ShowLoginPage = () => {
        history.push('/login');
    }
    return (
        <>
            <footer>
                <br />
                <p className="copyright">&copy; Copyright 2021 | <a href="https://instagram.com/ronakgiriraj">Patent Aide</a></p>

            </footer>

        </>
    );
}


export default ApplicationUserFooter;