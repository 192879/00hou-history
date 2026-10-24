export function toAstronomicalYear(year){
  if(!Number.isInteger(year))throw new TypeError('year must be an integer');
  return year<0?year+1:year;
}
export function fromAstronomicalYear(year){ return year<=0?year-1:year; }
export function addYears(historicalYear,amount){ return fromAstronomicalYear(toAstronomicalYear(historicalYear)+amount); }
export function displayYear(year){
  if(year===0)return '公元前1年至公元1年之交';
  return year<0?`公元前${Math.abs(year)}年`:`公元${year}年`;
}
export function ageAtYear(birthYear,currentYear){return toAstronomicalYear(currentYear)-toAstronomicalYear(birthYear)}
