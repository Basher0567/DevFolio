
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="brand footer-brand">
            Dev<span>Folio</span>
          </Link>
          <p>Portfolio, projects and ideas.</p>
        </div>

        <p>© {new Date().getFullYear()} DevFolio</p>
      </div>
    </footer>
  );
}
