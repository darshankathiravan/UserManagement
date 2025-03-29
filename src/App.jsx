import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import UsersList from "./pages/UserList";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar"; // Import Navbar

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <>
                  <Navbar /> {/* Navbar appears only for protected routes */}
                  <UsersList />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
