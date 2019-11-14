//==============================================================================
// Checks
//==============================================================================
const isNumber = seconds => {
  if (typeof seconds !== "number") {
    throw new TypeError(
      "Invalid value sent to s2hms, seconds must be a Number"
    );
  }
};

const isValidFormat = ({ format, formats } = {}) => {
  if (formats[format] === undefined) {
    throw new Error(`Invalid format "${format}"`);
  }
};

//==============================================================================
// Module - s2hms
//==============================================================================

const s2hms = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    separator: ":"
  };
  options = { ...defaults, ...options };
  const formats = {
    short: ["h", "m", "s"],
    long: ["hour", "minute", "second"],
    standard: ["", "", ""]
  };

  const time = [
    Math.floor(seconds / 60 / 60),
    Math.floor((seconds / 60) % 60),
    Math.floor(seconds % 60)
  ];

  const data = () => {
    return {
      ...options,
      formats: { ...formats },
      time: [...time]
    };
  };

  const nonZeroCondition = ({ val, format }) => {
    return format === "standard" || val !== 0;
  };

  const formatValue = ({ val, index, format, formats }) => {
    const value = setValue({ format, val });
    const prefix = setPrefix({ val, format });
    const formatString = formats[format][index];
    const postFix = setPostFix({ val, format });
    return `${prefix}${value}${formatString}${postFix}`;
  };

  const setPrefix = ({ val, format }) => {
    if (nonZeroCondition({ val, format })) {
      return val < 10 ? 0 : "";
    }

    if (val === 0) {
      return "";
    }
  };

  const setPostFix = ({ val, format }) => {
    if ((val === 0 && format === "long") || (val > 1 && format === "long")) {
      return "s";
    }

    return "";
  };

  const setValue = ({ format, val }) => {
    if (nonZeroCondition({ val, format })) {
      return val;
    }

    if (val === 0) {
      return 0;
    }
  };

  const addSeparator = ({ hms, separator }) => {
    return hms.join(separator);
  };

  const makeHms = data => {
    const { time, format, formats, separator } = data;
    isValidFormat({ format, formats });
    let hms = [];
    let zeroValCount = 0;
    time.forEach((val, index) => {
      if (nonZeroCondition({ val, format })) {
        return hms.push(formatValue({ index, val, format, formats }));
      }

      if (val === 0) {
        zeroValCount += 1;
        if (zeroValCount === 3) {
          return hms.push(formatValue({ index, val: 0, format, formats }));
        }
      }
    });
    return addSeparator({ hms, separator });
  };

  return makeHms(data());
};

//==============================================================================
// Modules - s2h, s2m, s2s
//==============================================================================

const getExplicitValue = data => {
  const { seconds, format, formats, unit, fallback, fallbackFunction } = data;
  isValidFormat({ format, formats });

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
