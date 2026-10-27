
import { useEffect, useState } from "react";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/education/")
      .then(({ data }) => setItems(data.results || data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section container">
      <SectionTitle eyebrow="LEARNING" title="Education" />
      {loading ? <p>Loading...</p> : items.length === 0 ? (
        <p>No education information added yet.</p>
      ) : (
        <div className="timeline">
          {items.map((item) => (
            <article className="timeline-item" key={item.id}>
              <p className="eyebrow">{item.start_date} — {item.end_date || "Present"}</p>
              <h3>{item.degree}</h3>
              <h4>{item.institution}</h4>
              {item.field_of_study && <p>{item.field_of_study}</p>}
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
