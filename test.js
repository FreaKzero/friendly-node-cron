const translate = require('./index');
const assert = require('assert');
const cron = require('node-cron');

const test = (check, should) => {
  console.log(` -> ${check}`);
  const expr = translate(check);

  if (expr !== null) {
    const checkexpr = cron.validate(expr);
    if (!checkexpr) {
      throw new Error('Cron Expression invalid');
    }
  }
  assert.equal(expr, should);
  console.log(new Array(100).fill('=').join(''));
};

test('at 2:30', '0 30 2 * * *');
test('on thursdays at 2:30', '0 30 2 * * 4');
test('on saturdays', '0 0 0 * * 6');
test('every 8 hours', '0 0 */8 * * *');
test('something', null);
test('every 15 minutes on dec 24', '0 */15 * 24 12 *');
test('every 15 minutes on wednesdays', '0 */15 * * * 3');
test('on saturdays at 0:10', '0 10 0 * * 6');
test('every 1 hour on dec 24', '0 0 */1 24 12 *');
test('every 3 hours on workdays', '0 0 */3 * * 1,2,3,4,5');
test('every 12 hours on weekends', '0 0 */12 * * 6,7');
test('every 20 seconds mondays tuesdays wednesdays', '*/20 * * * * 1,2,3');
test('at 13:37 on fridays tuesdays and thursdays', '0 37 13 * * 2,4,5');
test('at 9:00 on fri tue and mon', '0 0 9 * * 1,2,5');
test('At 12:10 on Monday and Tuesday in December', '0 10 12 * 12 1,2');
test('onN saturDas In deCmbeR aT 06:01', '0 1 6 * 12 6');
test('at 9:04:52 every mondays in december', '52 4 9 * 12 1');
test('on saturdays every 10 minutes', '0 */10 * * * 6');
test('every year', '0 0 0 1 1 *');
test('at 9:10 every year', '0 10 9 1 1 *');
test('at 9:10 every year on saturdays', '0 10 9 1 1 *');
test('every fri mon wed in oct at 10:30', '0 30 10 * 10 1,3,5');
test('very mondays in december all 15 minutes', '0 */15 * * 12 1');
test('on jan feb mar at 9:30', '0 30 9 * 1,2,3 *');
test('on jan feb mar only mondays tuesdays and saturdays at 9:30', '0 30 9 * 1,2,3 1,2,6');
test('on jan feb every 45 minutes', '0 */45 * * 1,2 *');

if (process.env.TESTWATCH) {
  process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
  console.clear();
}
