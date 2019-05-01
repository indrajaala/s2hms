# s2hms
> convert seconds to HMS (or) to either hours or minutes or seconds.

## Install

```
$ npm install --save s2hms
```

## Usage

contains two types of modules : 

1. s2hms
2. s2h, s2m, s2s


### 1) s2hms : converts seconds to 'hms' format.

takes two arguments :  seconds (`number`) , options (`object` optional)

```js
const {s2hms} = require('s2hms');

s2hms(4342);
// => 1:12:22

s2hms(64567, {format: 'short'});
// => 17h:56m:7s

s2hms(24535, {format: 'long'});
// => 6 hours:48 minutes:55 seconds

s2hms(8573, {format: 'long', separator: '__'})
// => 2 hours__22 minutes__53 seconds

```

### 2) ( s2h, s2m, s2s ) : converts seconds to either hours or minutes or seconds.

takes two arguments :  seconds (`number`) , options (`object` optional)

```js
 const {s2h} = require('s2hms'); 
 const {s2m} = require('s2hms'); 
 const {s2s} = require('s2hms'); 

 s2h(43434);
 // => 12.1
 
 s2m(9832, { format: "short" });
 // => 163.9 m
 
 s2m(98907, { format: "long" });
 // => 1648.5 minutes
 
 s2s(9832, { format: "short" });
 // => 9832 s
 

```



## License

MIT
