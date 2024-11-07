import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useOutletContext();

  // TBD - whether/how to add from-validation on frontend - TBD
  // TBD - any additional security for interceptions of this fetch - TBD

  async function handleFormSubmit(e) {
    e.preventDefault();
    // get data from latest state
    const formData = { username, password };
    const url = "http://localhost:3000/login";

    // Send POST request to the backend
    try {
      const response = await fetch(url, {
        method: "POST", // GET bu default
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // Un-successful Log in
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        if (response.status === 401) {
          console.error("Login error:", errorData.message);
          // Optional take errorData.errors and set state to show errors on the UI
          return;
        } else {
          // General server error handling
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
      }
      // Successful Log in
      const data = await response.json();
      console.log("User logged in successfully:", data);

      //   message: "Authentication passed and sent to user browser"
      //   success: true
      //   token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImlhdCI6MTczMDkwNzg
      //           yMiwiZXhwIjoxNzMwOTA3OTQyfQ.AVHCYTsSR74TPuKibhY_9UDr2c1TI34x-CDvnOulMGA"
      //   user: userId: 4, username: "brosen", userRole: USER
      localStorage.setItem("Authorization", data.token);
      localStorage.setItem("User", JSON.stringify(data.user));

      setUser(data.user);

      // Optionally redirect user or display a success message
    } catch (error) {
      console.error("Network error or unexpected error:", error.message);
      // Display general error message (e.g., set state to show in UI)
    }
  }

  return (
    <>
      <h1>Sign Up</h1>

      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Log in</button>

        {/* <div>
          <a href="/">Back to Home</a>
        </div> */}
        <div>
          <NavLink to="/">Back to Home with Navlink</NavLink>
        </div>
      </form>
    </>
  );
}
