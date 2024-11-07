import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenExistsAndStillValid } from "./utilities/authentication";

function App() {
  const [user, setUser] = useState(null);
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenExistsAndStillValid()) {
      // if Token is valid, set the user state
      const user = JSON.parse(localStorage.getItem("User"));
      setUser(user);
    } else {
      // if Token is invalid or missing - clear storage and redirect
      localStorage.removeItem("Authorization");
      localStorage.removeItem("User");
      navigate("/");
    }
  }, [navigate]);

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("Authorization");
    localStorage.removeItem("User");
    console.log("logged out successfully");
    navigate("/");
  };

  return (
    <>
      <nav>
        <h3>TOP Blog</h3>
        {user ? (
          <>
            <div>
              Welcome {user.username} {user.userRole}
            </div>
            <button onClick={handleLogOut}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="login">Login</NavLink>{" "}
            <NavLink to="signup">Sign up</NavLink>
          </>
        )}
        {/* <NavLink to="login">Login</NavLink>
        <NavLink to="signup">Sign up</NavLink>
        {userCredentials && <div>Welcome {userCredentials.user.username}</div>} */}
      </nav>
      <main>
        <Outlet context={[user, setUser]} />
      </main>
    </>
  );
}

export default App;
