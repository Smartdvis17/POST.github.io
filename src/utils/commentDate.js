// La API de comentarios no incluye fecha real, así que generamos una
// fecha simulada (pero determinista según el id) solo para fines visuales.
export const getFakeCommentDate = (id) => {
  const daysAgo = ((id * 7) % 60) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const relativeFormatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export const formatRelativeDate = (date) => {
  const diffDays = Math.round((date - new Date()) / (1000 * 60 * 60 * 24));
  return relativeFormatter.format(diffDays, "day");
};
