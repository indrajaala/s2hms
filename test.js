const { s2hms, s2h, s2m, s2s } = require("./index");

const invalidSecondsError =
  "Invalid value sent to s2hms, seconds must be a Number";

describe("s2hms", () => {
  test("throws error on invalid input of seconds", () => {
    expect(() => {
      s2hms("xyz");
    }).toThrowError(new Error(invalidSecondsError));

    expect(() => {
      s2hms("123");
    }).toThrowError(new Error(invalidSecondsError));
  });

  test("throws error on invalid format option", () => {
    const format = "strong";
    expect(() => {
      s2hms(3600, { format });
    }).toThrowError(new Error(`Invalid format "${format}"`));
  });

  test("converts seconds into hours minutes seconds", () => {
    expect(s2hms(45020)).toBe("12:30:20");
    expect(s2hms(432, { format: 'long' })).toBe('07minutes:12seconds')
    expect(s2hms(39090, { format: "standard" })).toBe("10:51:30");
    expect(s2hms(1432)).toBe("00:23:52");
    expect(s2hms(5445)).toBe("01:30:45");
    expect(s2hms(54453)).toBe("15:07:33");
    expect(s2hms(42243)).toBe("11:44:03");
    expect(s2hms(39090, { format: "short" })).toBe("10h:51m:30s");
    expect(s2hms(360, { format: 'long' })).toBe('06minutes')
    expect(s2hms(540, { format: 'short' })).toBe('09m')
    expect(s2hms(36, { format: "long" })).toBe("36seconds");
    expect(s2hms(45039, { format: "standard", separator: "_" })).toBe(
      "12_30_39"
    );
    expect(s2hms(23432, { format: "short", separator: "-" })).toBe(
      '06h-30m-32s',
    );
  });
});

describe("s2h, s2m, s2s", () => {
  test("throws error on invalid input of seconds", () => {
    expect(() => {
      s2h("xyz");
    }).toThrowError(new Error(invalidSecondsError));

    expect(() => {
      s2h("123");
    }).toThrowError(new Error(invalidSecondsError));

    expect(() => {
      s2m("fj#$^dkf");
    }).toThrowError(new Error(invalidSecondsError));

    expect(() => {
      s2s("043fsds");
    }).toThrowError(new Error(invalidSecondsError));
  });

  test("throws error on invalid format option", () => {
    const format = "strong";

    expect(() => {
      s2h(3600, { format });
    }).toThrowError(new Error(`Invalid format "${format}"`));

    expect(() => {
      s2m(3600, { format });
    }).toThrowError(new Error(`Invalid format "${format}"`));

    expect(() => {
      s2s(3600, { format });
    }).toThrowError(new Error(`Invalid format "${format}"`));
  });

  test("throws error when option- 'format:standard' is used along with 'fallback:true'", () => {
    const fallbackError = `option'fallback:true' can only be used when a format is specified`;
    expect(() => {
      s2h(342, { format: "standard", fallback: true });
    }).toThrowError(new Error(fallbackError));

    expect(() => {
      s2m(342, { format: "standard", fallback: true });
    }).toThrowError(new Error(fallbackError));
    expect(() => {
      s2s(342, { format: "standard", fallback: true });
    }).toThrowError(new Error(fallbackError));
  });
});

describe("s2h", () => {
  test("converts seconds into hours", () => {
    expect(s2h(43434)).toBe(12.1);
    expect(s2h(7878, { format: "short" })).toBe("2.2 h");
    expect(s2h(68676, { format: "standard" })).toBe(19.1);
    expect(s2h(3400, { format: "long", fallback: true })).toBe("56.7 minutes");
    expect(s2h(432, { format: "short", fallback: true })).toBe("7.2 m");
    expect(s2h(43, { format: "short", fallback: true })).toBe("43 s");
    expect(s2h(43)).toBe(0);
  });
});

describe("s2m", () => {
  test("converts seconds into minutes", () => {
    expect(s2m(98907, { format: "long" })).toBe("1648.5 minutes");
    expect(s2m(9832, { format: "short" })).toBe("163.9 m");
    expect(s2m(43, { format: "standard" })).toBe(0.7);
    expect(s2m(45, { format: "short", fallback: true })).toBe("45 s");
    expect(s2m(448, { format: "long", fallback: true })).toBe("7.5 minutes");
    expect(s2m(448)).toBe(7.5);
  });
});

describe("s2s", () => {
  test("converts seconds into seconds", () => {
    expect(s2s(98907, { format: "long" })).toBe("98907 seconds");
    expect(s2s(9832, { format: "short" })).toBe("9832 s");
    expect(s2s(43, { format: "standard" })).toBe(43);
    expect(s2s(43, { format: "long", fallback: true })).toBe("43 seconds");
    expect(s2s(43)).toBe(43);
  });
});
