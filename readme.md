# Friendly Node Cron

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![publish](https://github.com/FreaKzero/friendly-node-cron/actions/workflows/publish.yml/badge.svg)

Friendlier, human readable expressions for node-cron
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

# Speech Rules

Keyword `/(\s*?)at\s/` decides if an exact time (e.g: 09:40:31) is used or an interval (e.g: every hour, all 20 seconds, etc), seconds in exact times are optional.

Keyword `year` sets the pattern automatically to first of january. Day of weeks can not be used with year.

## Days:

Days will always translate in numbers. `weekends` translates to `6,7` and workdays will translate to `1,2,4,5`.

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

### Year

Every year is a special rule which will set the Crontab to first on january and its not possible to use a weekday for this expression.

```
every year at 9:30
```
