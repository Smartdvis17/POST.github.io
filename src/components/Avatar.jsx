const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const Avatar = ({ name, size = 40 }) => (
  <div
    className="avatar-circle"
    style={{ width: size, height: size, fontSize: size * 0.4 }}
  >
    {getInitials(name)}
  </div>
);
