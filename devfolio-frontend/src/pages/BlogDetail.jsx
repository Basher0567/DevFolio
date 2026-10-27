
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { mediaUrl } from "../components/ProjectCard";

function getVisitorKey() {
  let key = localStorage.getItem("devfolio_visitor_key");

  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("devfolio_visitor_key", key);
  }

  return key;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });

  async function loadComments(postSlug) {
    const response = await api.get("/comments/", {
      params: { "post__slug": postSlug },
    });
    setComments(response.data.results || response.data);
  }

  useEffect(() => {
    let active = true;
    setLoading(true);

    api.get(`/posts/${slug}/`)
      .then(async ({ data }) => {
        if (!active) return;
        setPost(data);
        try {
          const response = await api.get("/comments/", {
            params: { "post__slug": slug },
          });
          if (active) setComments(response.data.results || response.data);
        } catch {
          if (active) setComments([]);
        }
      })
      .catch(() => { if (active) setPost(null); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [slug]);

  async function handleLike() {
    try {
      await api.post("/likes/", {
        post: post.id,
        visitor_key: getVisitorKey(),
      });
      setPost((current) => ({
        ...current,
        like_count: (current.like_count || 0) + 1,
      }));
      setMessage("Thank you for your like!");
    } catch {
      setMessage("Could not submit your like. Please try again.");
    }
  }

  async function handleComment(event) {
    event.preventDefault();

    try {
      await api.post("/comments/", {
        post: post.id,
        ...commentForm,
      });

      setCommentForm({ name: "", email: "", content: "" });
      setMessage("Your comment has been submitted for approval.");
    } catch {
      setMessage("Could not submit your comment. Check your details and try again.");
    }
  }

  if (loading) return <section className="section container">Loading article...</section>;

  if (!post) {
    return (
      <section className="section container">
        <h1>Article not found</h1>
        <Link to="/blog">Back to blog</Link>
      </section>
    );
  }

  return (
    <article className="section container article">
      <Link to="/blog" className="text-link">← All articles</Link>
      <p className="eyebrow">{post.category_name || "Article"}</p>
      <h1>{post.title}</h1>
      <p className="muted">
        {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
      </p>

      {post.cover_image && (
        <img className="article-cover" src={mediaUrl(post.cover_image)} alt={post.title} />
      )}

      <p className="article-excerpt">{post.excerpt}</p>
      <div className="article-content">{post.content}</div>

      <button className="button" onClick={handleLike}>
        ♥ Like ({post.like_count || 0})
      </button>

      {message && <p role="status" className="form-message">{message}</p>}

      <section className="comments-section">
        <h2>Comments</h2>
        {comments.length === 0 ? <p>No approved comments yet.</p> : comments.map((comment) => (
          <article className="comment" key={comment.id}>
            <h3>{comment.name}</h3>
            <p>{comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleDateString()}</small>
          </article>
        ))}

        <h2>Leave a comment</h2>
        <form className="form-stack" onSubmit={handleComment}>
          <label>
            Name
            <input required maxLength={100} value={commentForm.name} onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })} />
          </label>
          <label>
            Email
            <input required type="email" value={commentForm.email} onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })} />
          </label>
          <label>
            Comment
            <textarea required maxLength={2000} rows={5} value={commentForm.content} onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })} />
          </label>
          <button className="button" type="submit">Submit for approval</button>
        </form>
      </section>
    </article>
  );
}
