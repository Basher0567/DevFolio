
import { NavLink } from "react-router-dom";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/skills", "Skills"],
  ["/experience", "Experience"],
  ["/education", "Education"],
  ["/projects", "Projects"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar container">
        <NavLink to="/" className="brand">
          Dev<span>Folio</span>
        </NavLink>

        <div className="nav-links">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
