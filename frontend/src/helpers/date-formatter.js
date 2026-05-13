export const formatTo12Hour = (dateString) => {
  if (!dateString) return "—";

  return new Date(dateString.replace(" ", "T")).toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
