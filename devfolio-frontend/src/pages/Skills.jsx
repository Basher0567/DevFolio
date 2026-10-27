
import { useEffect, useState } from "react";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";
import { Loading } from "../components/States";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/skills/")
      .then(({ data }) => setSkills(data.results || data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="section container">
      <SectionTitle eyebrow="MY TOOLKIT" title="Skills" description="Technologies and skills I have actually learned." />
      {skills.length === 0 ? <p>No skills added yet.</p> : (
        <div className="skill-grid">
          {skills.map((skill) => (
            <article className="card skill-card" key={skill.id}>
              <div className="skill-heading">
                <h3>{skill.name}</h3>
                <span>{skill.proficiency}%</span>
              </div>
              {skill.category && <p className="muted">{skill.category}</p>}
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${Math.min(100, skill.proficiency)}%` }} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
