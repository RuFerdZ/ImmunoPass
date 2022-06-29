import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="text-center">
            {/* <div className="app-name">ImmunoPass</div> */}
            <div className="primary-text black-color mt-5">Immun<span style={{ color: "#FF4C29" }}>o</span>Pass</div>
            <div className="main-center-container black-card mt-5">
                <div className="margin-bg p-4">
                    <Link to="/passport-holder/home">
                        <div className="button-primary mt-3">Passport Holder Login</div>
                    </Link>
                    <Link to="/doctor/home">
                        <div className="button-primary mt-3">Doctor Login</div>
                    </Link>
                    <Link to="/vaccination-camp/home">
                        <div className="button-primary mt-3">Vaccination Camp Login</div>
                    </Link>
                    <Link to="/verify/vaccination">
                        <div className="button-primary my-3">Validate Vaccination</div>
                    </Link>
                </div>
            </div>
           
        </div>
    );
}

export default LandingPage;