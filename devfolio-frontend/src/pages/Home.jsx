
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import SectionTitle from "../components/SectionTitle";
import { Loading } from "../components/States";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get("/profile/"),
      api.get("/projects/?is_featured=true"),
      api.get("/posts/?ordering=-published_at"),
    ])
      .then(([profileRes, projectRes, postRes]) => {
        if (!active) return;
        const profileData = profileRes.data;
        setProfile(Array.isArray(profileData) ? profileData[0] : profileData);
        setProjects(projectRes.data.results || projectRes.data);
        setPosts((postRes.data.results || postRes.data).slice(0, 3));
      })
      .catch(() => {
        if (active) setError("Could not load portfolio data. Please check the API server.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>
            <h1>
              Hello, I'm <span>{profile?.full_name || "Your Name"}</span>
            </h1>
            <h2>{profile?.title || "Developer & Lifelong Learner"}</h2>
            <p>{profile?.bio || "Add your real biography from the portfolio dashboard."}</p>

            <div className="hero-actions">
              <Link to="/projects" className="button">
                Explore projects <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="button button-outline">
                Contact me
              </Link>
            </div>

            <div className="social-links">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer">
                  <Github size={20} /> GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                  <Linkedin size={20} /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {profile?.profile_image && (
            <img
              className="hero-image"
              src={profile.profile_image.startsWith("http")
                ? profile.profile_image
                : `http://127.0.0.1:8000${profile.profile_image}`}
              alt={profile.full_name}
            />
          )}
        </div>
      </section>

      <section className="section container">
        <SectionTitle
          eyebrow="WHAT I BUILD"
          title="Featured Projects"
          description="A selection of my work and practical projects."
        />
        {error && <p className="error-message">{error}</p>}
        <div className="card-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <Link className="text-link" to="/projects">View all projects →</Link>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionTitle
            eyebrow="LATEST WRITING"
            title="From My Blog"
            description="Tutorials, learning notes and personal insights."
          />
          <div className="card-grid">
            {posts.map((post) => (
              <article className="card card-body" key={post.id}>
                <p className="eyebrow">{post.category_name || "Article"}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-link">
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
