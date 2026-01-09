export const formatTo12Hour = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // fallback

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
