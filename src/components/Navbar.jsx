import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    logout();
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-white text-xl font-semibold">User Management</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-white hidden sm:block">
            <p className="text-sm">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
