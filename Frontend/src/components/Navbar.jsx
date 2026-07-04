import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoFull from "../assets/logo-full.svg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img src={logoFull} alt="Are You Alive" style={{ height: 44 }} />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            to="/about"
            style={{ color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 14 }}
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/"
                style={{ color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 14 }}
              >
                Home
              </Link>
              <Link
                to="/profile"
                style={{ color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 14 }}
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 14 }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 14 }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
