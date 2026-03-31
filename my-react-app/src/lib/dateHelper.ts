
import moment from 'moment';

export const dateComparator = (valueA: string, valueB: string) => {
  const dateA = moment(valueA, "DD MMM, YYYY").toDate();
  const dateB = moment(valueB, "DD MMM, YYYY").toDate();
  return dateA.getTime() - dateB.getTime();
};