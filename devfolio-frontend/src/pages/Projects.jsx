
import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import SectionTitle from "../components/SectionTitle";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState(false);
  const [ordering, setOrdering] = useState("-created_at");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api.get("/projects/", {
      params: {
        search: search || undefined,
        is_featured: featured ? true : undefined,
        ordering,
      },
    })
      .then(({ data }) => {
        if (active) setProjects(data.results || data);
      })
      .catch(() => {
        if (active) setProjects([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [search, featured, ordering]);

  return (
    <section className="section container">
      <SectionTitle eyebrow="MY WORK" title="Projects" description="Explore projects, technologies and practical work." />

      <div className="filters">
        <input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search projects"
        />

        <select value={ordering} onChange={(event) => setOrdering(event.target.value)}>
          <option value="-created_at">Newest first</option>
          <option value="created_at">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Featured only
        </label>
      </div>

      {loading ? <p>Loading projects...</p> : (
        projects.length ? (
          <div className="card-grid">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : <p>No projects found.</p>
      )}
    </section>
  );
}
