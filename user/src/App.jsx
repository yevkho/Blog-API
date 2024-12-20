import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { tokenExistsAndStillValid } from "./utilities/authentication";

function App() {
  // potential to set auth data in broader context rather than parent Component, e.g., https://github.com/guskirb/blog-clientTOP/blob/main/src/context/auth.provider.tsx
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
      localStorage.removeItem("Authorization"); // can just be 'token' or jwt' in storage
      localStorage.removeItem("User");
      navigate("/");
    }
  }, [navigate]);

  const handleLogOut = () => {
    // set a separate logout function in utils better & redirect to '/profile/login'
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
