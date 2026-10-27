
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { logoutOwner } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    comments: 0,
    messages: 0,
  });
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [projectsRes, postsRes, commentsRes, messagesRes] =
        await Promise.all([
          api.get("/projects/"),
          api.get("/posts/"),
          api.get("/comments/"),
          api.get("/contact-messages/"),
        ]);

      const projectData = projectsRes.data.results || projectsRes.data;
      const postData = postsRes.data.results || postsRes.data;
      const commentData = commentsRes.data.results || commentsRes.data;
      const messageData = messagesRes.data.results || messagesRes.data;

      setStats({
        projects: projectsRes.data.count ?? projectData.length,
        posts: postsRes.data.count ?? postData.length,
        comments: commentsRes.data.count ?? commentData.length,
        messages: messagesRes.data.count ?? messageData.length,
      });

      setComments(commentData.filter((item) => !item.is_approved));
      setMessages(messageData);
    } catch {
      setError("Unable to load dashboard. Please log in again.");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function approveComment(id) {
    try {
      await api.post(`/comments/${id}/approve/`);
      await loadDashboard();
    } catch {
      setError("Could not approve this comment.");
    }
  }

  async function deleteComment(id) {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${id}/`);
      await loadDashboard();
    } catch {
      setError("Could not delete this comment.");
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this contact message?")) return;

    try {
      await api.delete(`/contact-messages/${id}/`);
      await loadDashboard();
    } catch {
      setError("Could not delete this message.");
    }
  }

  function handleLogout() {
    logoutOwner();
    navigate("/login", { replace: true });
  }

  return (
    <section className="section container">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">PRIVATE AREA</p>
          <h1>Owner Dashboard</h1>
          <p>Manage your portfolio and review visitor activity.</p>
        </div>
        <button className="button button-outline" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {error && <p role="alert" className="error-message">{error}</p>}

      <div className="stats-grid">
        {Object.entries(stats).map(([label, value]) => (
          <article className="card stat-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-shortcuts">
        <h2>Content management</h2>
        <p>Use the Django Admin or authenticated APIs to manage your content.</p>
        <a className="button" href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">
          Open Django Admin
        </a>
        <div className="shortcut-links">
          <Link to="/projects">View public projects</Link>
          <Link to="/blog">View public blog</Link>
          <Link to="/contact">View contact page</Link>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Pending comments</h2>
        {comments.length === 0 ? <p>No pending comments.</p> : (
          <div className="management-list">
            {comments.map((comment) => (
              <article className="management-item" key={comment.id}>
                <div>
                  <h3>{comment.name}</h3>
                  <p>{comment.content}</p>
                  <small>{comment.email} · Post ID: {comment.post}</small>
                </div>
                <div className="management-actions">
                  <button className="button" onClick={() => approveComment(comment.id)}>Approve</button>
                  <button className="button button-danger" onClick={() => deleteComment(comment.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Contact messages</h2>
        {messages.length === 0 ? <p>No contact messages.</p> : (
          <div className="management-list">
            {messages.map((item) => (
              <article className="management-item" key={item.id}>
                <div>
                  <h3>{item.subject}</h3>
                  <p>{item.message}</p>
                  <small>{item.name} · {item.email}</small>
                </div>
                <button className="button button-danger" onClick={() => deleteMessage(item.id)}>Delete</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
