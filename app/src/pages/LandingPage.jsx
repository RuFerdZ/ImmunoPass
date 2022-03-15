import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="main-center-container">
            <div className="landing-text">ImmunoPass</div>
            <hr className="mb-4" style={{ width: "50%", background: '#29707E' }} />
            <Link to="/passportHolder/login">
                <button className="actium-main-button mx-3">Passport Holder Login</button>
            </Link>
            <Link to="/doctor/login">
                <button className="actium-main-button mx-3">Doctor Login</button>
            </Link>
            <Link to="/vaccinationCamp/login">
                <button className="actium-main-button mx-3">Vaccination Camp Login</button>
            </Link>
        </div>
    );
}

export default LandingPage;