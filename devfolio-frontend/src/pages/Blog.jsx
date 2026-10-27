
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";
import { mediaUrl } from "../components/ProjectCard";

export default function Blog() {
  const [data, setData] = useState({ results: [], next: null, previous: null, count: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-published_at");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api.get("/posts/", {
      params: {
        page,
        search: search || undefined,
        ordering,
      },
    })
      .then(({ data: result }) => {
        if (active) {
          setData(Array.isArray(result)
            ? { results: result, next: null, previous: null, count: result.length }
            : result);
        }
      })
      .catch(() => {
        if (active) setData({ results: [], next: null, previous: null, count: 0 });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [page, search, ordering]);

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <section className="section container">
      <SectionTitle eyebrow="ARTICLES & IDEAS" title="My Blog" description="Notes, tutorials and lessons from my own journey." />

      <div className="filters">
        <input
          type="search"
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          placeholder="Search articles..."
        />
        <select value={ordering} onChange={(event) => { setOrdering(event.target.value); setPage(1); }}>
          <option value="-published_at">Latest first</option>
          <option value="published_at">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {loading ? <p>Loading articles...</p> : (
        <>
          <div className="card-grid">
            {data.results.map((post) => (
              <article className="card blog-card" key={post.id}>
                {post.cover_image && (
                  <img className="card-image" src={mediaUrl(post.cover_image)} alt={post.title} />
                )}
                <div className="card-body">
                  <p className="eyebrow">{post.category_name || "Article"}</p>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <p className="muted">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                  </p>
                  <Link className="text-link" to={`/blog/${post.slug}`}>Read article →</Link>
                </div>
              </article>
            ))}
          </div>

          {data.results.length === 0 && <p>No published articles found.</p>}

          <div className="pagination">
            <button className="button button-outline" disabled={!data.previous} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </button>
            <span>Page {page}</span>
            <button className="button button-outline" disabled={!data.next} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
