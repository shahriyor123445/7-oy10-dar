import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, Link, Form } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { editPost } from "../store/postsSlice";
import ClipLoader from "react-spinners/ClipLoader";

const PostPage = ({ posts, handleDelete }) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);

  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  async function handleEdit() {
    try {
      await api.patch("/posts/${post.id}", {
        title,
        body,
      });
      dispatch(editPost({ ...post, title, body }));
      setEdit(!edit);
    } catch (error) {
      setError(error.message);
    }
  }
  const navigate = useNavigate();

  return (
    <main className="PostPage">
      <article className="post">
        {post && (
          <>
            {edit ? (
              <form>
                <input
                  type="text"
                  name={"title"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  rows={"5"}
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className="postDate">{post.datetime}</p>
                <p className="postBody">{post.body}</p>
              </>
            )}
            <div className="buttons">
              <button className="danger" onClick={() => handleDelete(post.id)}>
                Delete
              </button>

              <button
                onClick={() => {
                  if (edit) {
                    // dispatch(editPost({ ...post, title, body }));
                    handleEdit();
                  } else {
                    setEdit(!edit);
                  }
                }}
              >
                {edit ? <> Save</> : "Edit"}
                <ClipLoader
                  loading={loading}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  cssOverride={{ borderColor: "white", marginLeft: "0.2em" }}
                />
              </button>

              <button onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </>
        )}
        {!post && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage
