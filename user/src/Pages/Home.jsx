import { useState, useEffect } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";

import { Editor } from "@tinymce/tinymce-react";

import {
  tokenExistsAndStillValid,
  getToken,
} from "../utilities/authentication";

function Home() {
  const [blogposts, setBlogposts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useOutletContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // TinyMCE content state

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const url = "http://localhost:3000/posts";
    // SET ROOT URL IN ENV VARIABLE IN VITE OR NETLIFY (security - otherwise visible in production code), e.g.,
    // const serverURL = import.meta.env.VITE_SERVER_URL;
    // const res = await fetch(`${serverURL}/api/articles/${endpoint}`);

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const processedResponse = await response.json();
        setBlogposts(processedResponse);
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
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    // get data from latest state
    const formData = { title, content };
    console.log(formData);
    const url = `http://localhost:3000/posts`;

    if (tokenExistsAndStillValid()) {
      // or reverse and if yes then simply logout() and redirect('/profile/login') and the rest can continue as normal
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(), // sends "Bearer [token]" to API
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Post created successfully:", data);
        // navigate("/"); // to re-render and fetch latest posts - does not work
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
  // return <Spinner />; // https://github.com/guskirb/blog-clientTOP/blob/main/src/components/spinner/spinner.tsx

  // ERROR
  if (error) return <p>Following Error ocurred: {error.message}</p>;

  // CONTENT
  return (
    <>
      <div className="postsContainer">
        {blogposts.map((post) => (
          <div key={post.id} className="post">
            <h4>{post.title}</h4>
            <div>{new Date(post.createdAt).toLocaleDateString()}</div>
            <div>{post.content}</div>
            {/* <a href={post.id}>Read</a> */}
            <NavLink to={`/${post.id}`}>Read</NavLink>
          </div>
        ))}
      </div>

      {user && user.userRole === "ADMIN" && (
        <>
          <h3>Write Blog Post</h3>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="title">Title: </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="content">Blog Post: </label>
              {/* <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              /> */}
              <Editor
                apiKey="r0wna1dx6guyxq0c3ci0cbzj5me1vfmtmbxn3yy61kbz8yzm" // Add your TinyMCE API key
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 300,
                  menubar: true,
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "image",
                    "link",
                    "lists",
                    "media",
                    "table",
                    "visualblocks",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | bold italic underline | link image media | align | numlist bullist",
                }}
              />
            </div>

            <button type="submit">Add Blog Post</button>
          </form>
        </>
      )}
    </>
  );
}

export default Home;
