import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "./Header.css"; // Import the CSS file

const Header = () => {
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const numFlakes = 25;
        const flakes = Array.from({ length: numFlakes }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            size: `${Math.random() * 6 + 4}px`, 
            animationDuration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 3}s`
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <header className="header">
            {snowflakes.map((flake) => (
                <span
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: flake.left,
                        fontSize: flake.size,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.delay
                    }}
                >
                    ❄
                </span>
            ))}

            <Link id="header-logo" to="/">LOGO</Link>

            <nav className="links--wrapper">
                <Link to="/" className="header--link">Home</Link>
                <Link to="/dns" className="header--link">DNS</Link>
                {user && <Link to="/profile" className="header--link">Profile</Link>}
                {user ? (
                    <button onClick={logoutUser} className="btn">Logout</button>
                ) : (
                    <Link className="btn" to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
