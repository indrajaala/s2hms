# s2hms
> convert seconds to HMS (or) to either hours or minutes or seconds explicitly.

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

s2hms(432, { format: "long" });
// => 7 minutes:12 seconds

s2hms(8573, {format: 'long', separator: '__'})
// => 2 hours__22 minutes__53 seconds

```

#### options

| **key** | **val** | **type** | **default val** |
| --- | --- | --- | --- |
| format |'long', 'short' | `string` | none |
| separator | any string char ':' , '+' , '=' , '_' ,'-' , etc... | `string` | ':' |
  
  
  
 **example:**
 
 with separator: '/' and format: 'short'

```js
s2hms(983, {format: 'short', separator: '/'});
// => 16m/23s

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

#### options

| **key** | **val** | **type** | **default val** |
| --- | --- | --- | --- |
| format | 'long', 'short' | `string` | none |
| fallback | true, false | `boolean` | false |

when fallback is set to true, conversion auto downgrades to next unit if the resulting value is less than 1 (one), 

**examples:**

without fallback

```js
s2h(983, {format: 'short'});
// => 0.3 h
```
with fallback set to true

```js
s2h(983, {format: 'short', fallback: true});
// => 16.4 m
```

without fallback

```js
s2m(46, {format: 'long'});
// => 0.8 minute
```

with fallback set to true

```js
s2m(46, {format: 'long', fallback: true});
// => 46 seconds
```

**note:**
fallback can be used only when a format is specified , if no format is specified and fallback is set to true , it will throw an error, this is to prevent confusion of unit of resulting value.

```js
s2h(634, {fallback: true});
// =>  Error: option'fallback:true' can only be used when a format is specified 
```


## License

MIT
