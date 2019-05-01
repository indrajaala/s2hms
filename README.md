# s2hms
> convert seconds to HMS (or) to hours, minutes, seconds independently.

## Install

```
$ npm install --save s2hms
```

## Usage

contains two types of modules :

1) s2hms : converts seconds to 'hms' format.

```js
const {s2hms} = require('s2hms');

s2hms(4342);
// => 1:12:22

s2hms(64567, {format: 'short'});
// => 17h:56m:7s

s2hms(24535, {format: 'long'});
// => 6 hours:48 minutes:55 seconds

```

2) ( s2h, s2m, s2s ) : converts seconds to hours or minutes or seconds.

```js
 const {s2h, s2m, s2s} = require('s2hms'); 

 

```



## License

MIT @ [Michael Wuergler](http://www.numetriclabs.com)
