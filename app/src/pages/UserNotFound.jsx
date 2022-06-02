import { useNavigate } from "react-router-dom";

export default function UserNotFount(){
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <div className="primary-text main-center-container">User Not Found</div>
            <button className="button-secondary py-2"
                onClick={() => navigate(-1)}
            >back</button>
        </div>
    )
}