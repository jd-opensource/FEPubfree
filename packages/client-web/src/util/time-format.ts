export const timeFormat = (time) => {
  if (!time) {
    return "";
  }

  const d = new Date(time);
  const year = fillZero(d.getFullYear()),
    month = fillZero(d.getMonth() + 1),
    day = fillZero(d.getDate()),
    hour = fillZero(d.getHours()),
    minute = fillZero(d.getMinutes()),
    second = fillZero(d.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const fillZero = (num) => {
  if (num < 10) {
    return "0" + num;
  }
  return num;
};
