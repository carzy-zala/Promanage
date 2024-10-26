function formatDate(date) {
  const options = { month: "short", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  const day = new Date(date).getDate();

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithSuffix = day + getDaySuffix(day);
  return formattedDate.replace(day, dayWithSuffix);
}


export default formatDate