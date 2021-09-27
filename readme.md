# Friendly Node Cron

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) ![publish](https://github.com/FreaKzero/friendly-node-cron/actions/workflows/publish.yml/badge.svg)

[![NPM](https://nodei.co/npm/friendly-node-cron.png)](https://nodei.co/npm/friendly-node-cron/)

Friendlier, human readable expressions for node-cron  
Cron Expressions are doublechecked with [crontab.guru](https://crontab.guru/)

Inspired by https://github.com/jkriss/friendly-cron

How to install:

```
npm install friendly-node-cron
```

Usage:

```
const translate = require('friendly-node-cron');
const cron = require('node-cron');

cron.schedule(translate('at 9:04:52 every mondays in december'), () => {
  console.log('running job...')
});
// Generated Expression: 52 4 9 * 12 1

cron.schedule(translate('on mondays in december all 15 minutes'), () => {
  console.log('running job...')
});
// Generated Expression: 0 */15 * * 12 1

translate('invalid expr');
// returns null
// Also all Patterns which are resulting in '* * * * * *' will automatically return null.
```

# Tested complex examples
Look into [./test.js](https://github.com/FreaKzero/friendly-node-cron/blob/main/test.js) for more examples and the parsed cron expressions.

```
at 00:00 on dec 24
every 20 seconds mondays tuesdays wednesdays
at 13:37 on fridays tuesdays and thursdays
At 12:10 on Monday and Tuesday in December
onN saturDas In deCmbeR aT 06:01
at 9:04:52 every mondays in december
on saturdays every 10 minutes
very mondays in december all 15 minutes
on jan feb mar only mondays tuesdays and saturdays at 9:30
every 15 minutes from 5 through 15 of december and january
on march and april from 15 through 25 on every 2 hours
weekly in 15 minute intervals on january
quarterly at 9:30 on mondays
```
# Speech Rules

## Days:

Days will always translate in numbers. `weekends` translates to `6,0` and workdays will translate to `1-5`.

You can also write the full words like `on saturday at 9:30`

### Tokens

`mon, tue, wed, thu, fri, sat, sun, weekends, workdays`

Examples:

```
on mon tue wed every 15 minutes
in december on mondays and saturdays at 9:30
on mondays at 10:30
```

## Dates/Months:

You can either use exact dates like `in dec 9 at 9:30` or only months `in dec at 9:30`  
You can also write the full words like `in december at 9:30`  
Multiple Months are supported  
You can also use the expression `from <num> through <num>` to define a day interval

### Tokens

`jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec`  
`from <num> through <num>`

Examples:

```
on jan feb mar only mondays tuesdays and saturdays at 9:30
on dec mar apr at 13:37
on march and april from 15 through 25 on every 2 hours
```

## Times:

Times will get sanitized and seconds are optional, to use times the token _at_ is needed. Timeformat is 24 hours and not AM/PM.

Examples:

```
every saturday at 10:32:32
in december on mondays and fridays at 08:05:01
at 18:15 on fri mon tue wed
```

## Intervals:

Be sure when you want to use intervals that you dont use the _at_ token in your expression.

### Tokens:

`second, minute, hour, day, month`

Examples:

```
on Saturdays every 15 minutes
on december every 1 hour
every 12 hours
```

## Special Tokens

### Yearly

Always will run on first of january at 0:00 if no time is given.  
Weekdays are not possible with this expression and will be overwritten.

Examples:

```
yearly
yearly at 9:30
```

### Weekly

Weekly will run on every 7th day of month (\*/7) at 0:00 if no time is given.  
Weekdays are not possible with this expression and will be overwritten.

Examples:

```
weekly at 9:30
weekly in 15 minute intervals on january
```

### Quarterly

Quarterly will run on every 3rd month of year (\*/3) at 0:00 if no time is given.  
Weekdays are possible

Examples:

```
quarterly at 9:30
quarterly at 9:30 on mondays
```
