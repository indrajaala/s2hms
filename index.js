const isNumber = seconds => {
  if (typeof seconds !== "number") {
    throw new TypeError(
      "Invalid value sent to s2hms, seconds must be a Number"
    );
  }
};

const isValidFormat = (format, formats) => {
  if (formats[format] === undefined) {
    throw new Error(`Invalid format "${format}"`);
  }
};

const s2hms = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    separator: ":"
  };

  const data = {
    ...{ ...defaults, ...options },
    formats: {
      short: ["h", "m", "s"],
      long: ["hour", "minute", "second"],
      standard: ["", "", ""]
    },
    time: [
      Math.floor(seconds / 60 / 60),
      Math.floor((seconds / 60) % 60),
      Math.floor(seconds % 60)
    ]
  };
  return getHMS(data);
};

const getHMS = data => {
  const { format, separator, formats, time } = data;
  let hms = [];
  let zeroValCount = 0;
  isValidFormat(format, formats);
  time.forEach((val, index) => {
    const formatValue = ({
      value = val,
      formatString = formats[format][index],
      postfix = ""
    } = {}) => {
      return `${value}${formatString}${postfix}`;
    };

    if (format === "standard") {
      val = val < 10 ? `0${val}` : val;
      return hms.push(formatValue());
    }

    val = val !== 0 && val < 10 ? `0${val}` : val;

    if (format === "long") {
      if (val !== 0) {
        if (val > 1) {
          return hms.push(formatValue({ postfix: "s" }));
        } else {
          return hms.push(formatValue());
        }
      } else {
        zeroValCount += 1;
        if (zeroValCount === 3) {
          return hms.push(formatValue({ value: 0, postfix: "s" }));
        }
      }
    }

    if (format === "short") {
      if (val !== 0) {
        return hms.push(formatValue());
      } else {
        zeroValCount += 1;
        if (zeroValCount === 3) {
          return hms.push(formatValue({ value: 0 }));
        }
      }
    }
  });
  return hms.join(separator);
};

const getExplicitValue = data => {
  const { seconds, format, formats, unit, fallback, fallbackFunction } = data;
  isValidFormat(format, formats);

  if (fallback === true) {
    if (format === "standard") {
      throw new Error(
        `option'fallback:true' can only be used when a format is specified`
      );
    }
    if (unit < 1 && fallbackFunction) {
      return fallbackFunction(seconds, { format, fallback });
    }
  }

  const formatValue = ({
    value = unit,
    formatString = formats[format],
    postfix = ""
  } = {}) => {
    return `${value} ${formatString}${postfix}`;
  };

  if (format === "standard") {
    return Number(unit);
  }
  if (format === "long") {
    if (unit < 1) {
      return formatValue({ value: 0, postfix: "s" });
    }
    if (unit > 1) {
      return formatValue({ postfix: "s" });
    } else {
      return formatValue();
    }
  }
  if (format === "short") {
    if (unit < 1) {
      return formatValue({ value: 0 });
    }
    return formatValue();
  }
};

const s2h = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false,
    name: "s2h",
    fallbackFunction: s2m
  };
  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "h", long: "hour", standard: "" },
    unit: (seconds / 3600).toFixed(1)
  };

  return getExplicitValue(data);
};

const s2m = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false,
    name: "s2m",
    fallbackFunction: s2s
  };

  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "m", long: "minute", standard: "" },
    unit: (seconds / 60).toFixed(1)
  };

  return getExplicitValue(data);
};

const s2s = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    name: "s2s"
  };
  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "s", long: "second", standard: "" },
    unit: seconds
  };

  return getExplicitValue(data);
};

module.exports = { s2hms, s2h, s2m, s2s };
