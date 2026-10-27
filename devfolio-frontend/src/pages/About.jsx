
import { useEffect, useState } from "react";
import api from "../services/api";
import SectionTitle from "../components/SectionTitle";
import { Loading } from "../components/States";
import { mediaUrl } from "../components/ProjectCard";

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/profile/")
      .then(({ data }) => setProfile(Array.isArray(data) ? data[0] : data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="section container">
      <SectionTitle eyebrow="ABOUT ME" title="My Story" />
      {profile ? (
        <div className="about-layout">
          {profile.profile_image && (
            <img className="about-image" src={mediaUrl(profile.profile_image)} alt={profile.full_name} />
          )}
          <div>
            <h2>{profile.full_name}</h2>
            <h3>{profile.title}</h3>
            <p className="long-text">{profile.bio}</p>
            {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
            {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
            {profile.resume && (
              <a className="button" href={mediaUrl(profile.resume)} target="_blank" rel="noreferrer">
                View résumé
              </a>
            )}
          </div>
        </div>
      ) : <p>Profile information has not been added yet.</p>}
    </section>
  );
}
