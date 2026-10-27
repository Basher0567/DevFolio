
export function Loading() {
  return <div className="container state-message">Loading...</div>;
}

export function ErrorMessage({ message }) {
  return <div className="container error-message">{message}</div>;
}

export function EmptyState({ message = "No information available yet." }) {
  return <div className="empty-state">{message}</div>;
}
