import { useNavigate } from "react-router-dom";

export default function UserExists(){
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <div className="primary-text main-center-container">User Already Exist</div>
            <button
                className="button-secondary py-2 mx-auto"
                onClick={() => navigate(-1)}
            >
                back
            </button>
        </div>
    )
}