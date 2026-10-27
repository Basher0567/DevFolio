
import { Link } from "react-router-dom";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/api\/?$/, "");

export function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function ProjectCard({ project }) {
  const technologies = (project.technologies || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <article className="card project-card">
      {project.image && (
        <img
          className="card-image"
          src={mediaUrl(project.image)}
          alt={project.title}
        />
      )}

      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tag-list">
          {technologies.map((technology) => (
            <span className="tag" key={technology}>{technology}</span>
          ))}
        </div>

        <div className="card-actions">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
