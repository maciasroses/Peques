const formatdateTime = (date: string) => {
  console.log(date);
  const auxDate = new Date(date);
  const timeNow = new Date();
  auxDate.setHours(
    timeNow.getHours(),
    timeNow.getMinutes(),
    timeNow.getSeconds(),
    timeNow.getMilliseconds()
  );
  console.log(auxDate);
  return auxDate;
};

export default formatdateTime;
