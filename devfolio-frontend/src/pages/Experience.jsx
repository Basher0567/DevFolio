
import { useEffect, useState } from "react";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/experiences/")
      .then(({ data }) => setItems(data.results || data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section container">
      <SectionTitle eyebrow="MY JOURNEY" title="Experience" />
      {loading ? <p>Loading...</p> : items.length === 0 ? (
        <p>Add your real professional or practical experience when available.</p>
      ) : (
        <div className="timeline">
          {items.map((item) => (
            <article className="timeline-item" key={item.id}>
              <p className="eyebrow">{item.start_date} — {item.is_current ? "Present" : item.end_date || "N/A"}</p>
              <h3>{item.position}</h3>
              <h4>{item.company}{item.location ? ` · ${item.location}` : ""}</h4>
              <p className="long-text">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
