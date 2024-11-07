import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatPassword] = useState("");

  // TBD - whether/how to add from-validation on frontend - TBD
  // TBD - any additional security for interceptions of this fetch - TBD

  async function handleFormSubmit(e) {
    // send to API POST "http://localhost:3000/signup"
    e.preventDefault();

    // get data from latest state
    const formData = { username, email, password, repeatpassword };
    const url = "http://localhost:3000/signup";

    // Send POST request to the backend
    try {
      const response = await fetch(url, {
        method: "POST", // GET bu default
        // mode: 'cors', no need if back end is configured for cors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        // 400-type responses or 500 responses (response promise not rejected)
        if (response.status === 400 && errorData.errors) {
          // Validation error handling
          console.error("Validation Errors:", errorData.errors);
          // Optional take errorData.errors and set state to show errors on the UI
          return;
        } else {
          // General server error handling
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
      }
      // Successful Signup
      const data = await response.json();
      console.log("User registered successfully:", data);
      // Optionally redirect user or display a success message
    } catch (error) {
      console.error("Network error or unexpected error:", error.message);
      // Display general error message (e.g., set state to show in UI)
    }
  }

  return (
    <>
      <h1>Sign Up</h1>

      {/* <form action="http://localhost:3000/signup" method="POST"> RELOADS PAGE BY DEFAULT*/}
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
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div>
          <label htmlFor="repeatpassword">Confirm Password: </label>
          <input
            id="repeatpassword"
            name="repeatpassword"
            type="password"
            value={repeatpassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
