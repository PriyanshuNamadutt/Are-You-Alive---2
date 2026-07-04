import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { PrivateRoute, RequireDetails } from "./components/PrivateRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import DetailsForm from "./pages/DetailsForm";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/details"
          element={
            <PrivateRoute>
              <DetailsForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <RequireDetails>
              <Home />
            </RequireDetails>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireDetails>
              <Profile />
            </RequireDetails>
          }
        />
      </Routes>
    </>
  );
}

export default App;
