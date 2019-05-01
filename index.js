const isNumber = seconds => {
  if (typeof seconds !== "number") {
    throw new Error("Invalid value sent to s2hms, seconds must be a Number");
  }
};

const s2hms = (seconds, options = {}) => {
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
  const hms = [];
  time.forEach((val, index) => {
    if (val !== 0) {
      try {
        if (format === "long" && val > 1) {
          hms.push(`${val} ${formats[format][index]}s`);
        } else {
          hms.push(`${val}${formats[format][index]}`);
        }
      } catch (e) {
        throw new Error(`Invalid format "${format}"`);
      }
    }
  });
  return hms.join(separator);
};

const getIndividualValue = data => {
  const { seconds, format, formats, unit, fallback, fallbackFunction } = data;
  if (formats[format] === undefined) {
    throw new Error(`Invalid format "${format}"`);
  }

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

  try {
    if (format === "long" && unit > 1) {
      return `${unit} ${formats[format]}s`;
    }

    if (format === "standard") {
      return Number(unit);
    } else {
      return `${unit} ${formats[format]}`;
    }
  } catch (e) {
    throw new Error(e);
  }
};

const s2h = (seconds, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false
  };

  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "h", long: "hour", standard: "" },
    unit: (seconds / 3600).toFixed(1),
    fallbackFunction: s2m
  };

  return getIndividualValue(data);
};

const s2m = (seconds, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false
  };

  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "m", long: "minute", standard: "" },
    unit: (seconds / 60).toFixed(1),
    fallbackFunction: s2s
  };

  return getIndividualValue(data);
};

const s2s = (seconds, options = {}) => {
  isNumber(seconds);
  const defaults = { format: "standard" };
  const data = {
    ...{ seconds, ...defaults, ...options },
    formats: { short: "s", long: "second", standard: "" },
    unit: seconds
  };

  return getIndividualValue(data);
};

module.exports = { s2hms, s2h, s2m, s2s };
