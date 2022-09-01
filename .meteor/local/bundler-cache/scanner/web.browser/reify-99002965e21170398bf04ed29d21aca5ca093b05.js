module.export({default:()=>getISOWeek});let toDate;module.link("../toDate/index.js",{default(v){toDate=v}},0);let startOfISOWeek;module.link("../startOfISOWeek/index.js",{default(v){startOfISOWeek=v}},1);let startOfISOWeekYear;module.link("../startOfISOWeekYear/index.js",{default(v){startOfISOWeekYear=v}},2);let requiredArgs;module.link("../_lib/requiredArgs/index.js",{default(v){requiredArgs=v}},3);



var MILLISECONDS_IN_WEEK = 604800000;
/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|Number} date - the given date
 * @returns {Number} the ISO week
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */

function getISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime(); // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)

  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}