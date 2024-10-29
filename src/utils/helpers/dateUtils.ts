import { DateTime } from 'luxon';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
  const day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate().toString();
  return `${year}-${month}-${day}`;
}


export function compareDates(date: string): string {
  const currentDateTime = DateTime.now();

  console.log(date);
  const targetDateTime = DateTime.fromISO(date);



 
  //const diff = currentDateTime.diff(targetDateTime);
  const diff = currentDateTime.diff(targetDateTime, ['years', 'months', 'weeks', 'days', 'hours', 'minutes']).toObject();

  //console.log(diff)//Aqui o console

  if (diff.years !== undefined && diff.years !== 0) {
    return `${Math.abs(diff.years)} ano${Math.abs(diff.years) > 1 ? 's' : ''}`;
  } else if (diff.months !== undefined && diff.months !== 0) {
    return `${Math.abs(diff.months)} mês${Math.abs(diff.months) > 1 ? 'es' : ''}`;
  } else if (diff.weeks !== undefined && diff.weeks !== 0) {
    return `${Math.abs(diff.weeks)} semana${Math.abs(diff.weeks) > 1 ? 's' : ''}`;
  } else if (diff.days !== undefined && diff.days !== 0) {
    return `${Math.abs(diff.days)} dia${Math.abs(diff.days) > 1 ? 's' : ''}`;
  } else if (diff.hours !== undefined && diff.hours !== 0) {
    return `${Math.abs(diff.hours)} hora${Math.abs(diff.hours) > 1 ? 's' : ''}`;
  } else if (diff.minutes !== undefined && diff.minutes !== 0) {
    return `${Math.abs(Math.floor(diff.minutes))} minuto${Math.abs(Math.floor(diff.minutes)) > 1 ? 's' : ''}`;
  }else{
    return 'date'
  }


}
