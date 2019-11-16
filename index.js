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

const makeExplicitTimeUnit = data => {
  const { seconds, format, formats, val, fallback, fallbackFunction } = data;
  isValidFormat({ format, formats });

  const validateFallback = ({
    format,
    val,
    fallback,
    seconds,
    fallbackFunction
  }) => {
    if (fallback === true) {
      if (format === "standard") {
        throw new Error(
          `option'fallback:true' can only be used when a format is specified`
        );
      }
      if (val < 1 && fallbackFunction) {
        return fallbackFunction(seconds, { format, fallback });
      }
    }
  };
  const setPostfix = ({ format, val }) => {
    if (
      (val === "0.0" && format === "long") ||
      (val > 1 && format === "long")
    ) {
      return "s";
    }

    return "";
  };

  const setValue = ({ val }) => {
    if (val === "0.0") {
      return 0;
    }
    return val;
  };

  const formatValue = ({ formats, format, val }) => {
    if (format === "standard") {
      return Number(val);
    }
    const formatString = formats[format];
    const postfix = setPostfix({ format, val });
    const value = setValue({ val });
    return `${value} ${formatString}${postfix}`;
  };

  return (
    validateFallback({ format, seconds, val, fallback, fallbackFunction }) ||
    formatValue({ formats, format, val })
  );
};

const s2h = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false,

    fallbackFunction: s2m
  };
  const data = () => {
    return {
      ...{ seconds, ...defaults, ...options },
      formats: { short: "h", long: "hour", standard: "" },
      val: (seconds / 3600).toFixed(1)
    };
  };

  return makeExplicitTimeUnit({ ...data() });
};

const s2m = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard",
    fallback: false,

    fallbackFunction: s2s
  };

  const data = () => {
    return {
      ...{ seconds, ...defaults, ...options },
      formats: { short: "m", long: "minute", standard: "" },
      val: (seconds / 60).toFixed(1)
    };
  };

  return makeExplicitTimeUnit({ ...data() });
};

const s2s = (seconds = 0, options = {}) => {
  isNumber(seconds);
  const defaults = {
    format: "standard"
  };
  const data = () => {
    return {
      ...{ seconds, ...defaults, ...options },
      formats: { short: "s", long: "second", standard: "" },
      val: seconds
    };
  };

  return makeExplicitTimeUnit({ ...data() });
};

module.exports = { s2hms, s2h, s2m, s2s };
