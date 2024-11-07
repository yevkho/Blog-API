import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  tokenExistsAndStillValid,
  getToken,
} from "../utilities/authentication";

function Post() {
  const { postId } = useParams();

  const [blogpost, setBlogpost] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(blogpost);

  const [user, setUser] = useOutletContext();
  console.log(`user is ${user}`);

  const [comment, setComment] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const url = `http://localhost:3000/posts/${postId}`;

    async function fetchData() {
      console.log("Starting fetch...");
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const processedResponse = await response.json();
        setBlogpost(processedResponse);
        setLoading(false);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          setError(error);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [postId]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    // get data from latest state
    const formData = { content: comment, authorId: user.userId };
    const url = `http://localhost:3000/posts/${postId}/comments`;

    // get JWT
    // const token = localStorage.getItem("Authorization");
    // console.log(token);

    // function isTokenStillValid(token) {
    //   const decodedToken = jwtDecode(token);
    //   console.log(`Decoded token ${decodedToken}`);
    //   const currentTime = Date.now() / 1000; // Convert to seconds
    //   const stillValid = decodedToken.exp > currentTime;
    //   return stillValid;
    // }

    if (tokenExistsAndStillValid()) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(), // sends "Bearer [token]" to API
            // SET AUTHORIZATION HEADER
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Comment created successfully:", data);
      } catch (error) {
        console.error("Network error or unexpected error:", error.message);
      }
    } else {
      // Token is missing or expired - log out the user
      setUser(null);
      localStorage.removeItem("Authorization");
      console.log("Authentication expired");
      navigate("/");
    }
  }

  // LOADING
  if (loading) return <p>Loading...</p>;

  // ERROR
  if (error) return <p>Following Error ocurred: {error.message}</p>;

  // CONTENT
  return (
    <>
      <div className="post">
        <h2>{blogpost.title}</h2>
        <div>{blogpost.author.username}</div>
        <div>{new Date(blogpost.createdAt).toLocaleDateString()}</div>
        <div>{blogpost.content}</div>

        {blogpost.comments && (
          <>
            <div>Comments: </div>
            {blogpost.comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div>{comment.authorId}</div>
                <div>{comment.content}</div>
                {user && comment.authorId === user.userId && (
                  <div className="userButtons">
                    <button>edit</button>
                    <button>delete</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {user && (
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="comment">Comment: </label>
              <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div>

            <button type="submit">Add User Comment</button>
          </form>
        )}

        <div>
          <NavLink to="/">Back to Home</NavLink>
        </div>
      </div>
    </>
  );
}

export default Post;
