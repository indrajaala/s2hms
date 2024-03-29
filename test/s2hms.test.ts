import {describe, test, expect} from "vitest";
import {s2hms, s2h, s2m, s2s} from "../src/main";

describe("s2hms", () => {
    test("converts seconds into hours minutes seconds", () => {
        expect(s2hms(45020)).toBe("12:30:20");
        expect(s2hms(1, {format: "long"})).toBe("01second");
        expect(s2hms(432, {format: "long"})).toBe("07minutes:12seconds");
        expect(s2hms(39090, {format: "standard"})).toBe("10:51:30");
        expect(s2hms(1432)).toBe("00:23:52");
        expect(s2hms(5445)).toBe("01:30:45");
        expect(s2hms(54453)).toBe("15:07:33");
        expect(s2hms(42243)).toBe("11:44:03");
        expect(s2hms(39090, {format: "short"})).toBe("10h:51m:30s");
        expect(s2hms(360, {format: "long"})).toBe("06minutes");
        expect(s2hms(540, {format: "short"})).toBe("09m");
        expect(s2hms(36, {format: "long"})).toBe("36seconds");
        expect(s2hms(45039, {format: "standard", separator: "_"})).toBe(
            "12_30_39"
        );
        expect(s2hms(23432, {format: "short", separator: "-"})).toBe(
            "06h-30m-32s"
        );
    });

    test("returns expected results on zero condition", () => {
        expect(s2hms(0)).toBe("00:00:00");
        expect(s2hms(0, {format: "long"})).toBe("0seconds");
        expect(s2hms(0, {format: "short"})).toBe("0s");
    });
});

describe("s2h, s2m, s2s", () => {
    test("throws error when option- 'format:standard' is used along with 'fallback:true'", () => {
        const fallbackError = `option'fallback:true' can only be used when a format is specified other than default standard`;
        expect(() => {
            s2h(342, {format: "standard", fallback: true});
        }).toThrowError(new Error(fallbackError));

        expect(() => {
            s2m(342, {format: "standard", fallback: true});
        }).toThrowError(new Error(fallbackError));
        expect(() => {
            s2s(342, {format: "standard", fallback: true});
        }).toThrowError(new Error(fallbackError));
    });

    test("converts seconds into hours", () => {
        expect(s2h(43434)).toBe("12.1");
        expect(s2h(7878, {format: "short"})).toBe("2.2 h");
        expect(s2h(68676, {format: "standard"})).toBe("19.1");
        expect(s2h(3400, {format: "long", fallback: true})).toBe("56.7 minutes");
        expect(s2h(432, {format: "short", fallback: true})).toBe("7.2 m");
        expect(s2h(43, {format: "short", fallback: true})).toBe("43 s");
        expect(s2h(43)).toBe("0");
        expect(s2h(1, {format: "long"})).toBe("0 hours");
    });

    test("converts seconds into minutes", () => {
        expect(s2m(98907, {format: "long"})).toBe("1648.5 minutes");
        expect(s2m(9832, {format: "short"})).toBe("163.9 m");
        expect(s2m(43, {format: "standard"})).toBe('0.7');
        expect(s2m(45, {format: "short", fallback: true})).toBe("45 s");
        expect(s2m(448, {format: "long", fallback: true})).toBe("7.5 minutes");
        expect(s2m(448)).toBe("7.5");
        expect(s2m(0, {format: "long"})).toBe("0 minutes");
    });

    test("converts seconds into seconds", () => {
        expect(s2s(98907, {format: "long"})).toBe("98907 seconds");
        expect(s2s(9832, {format: "short"})).toBe("9832 s");
        // expect(s2s(43, {format: "standard"})).toBe(43);
        expect(s2s(43, {format: "long", fallback: true})).toBe("43 seconds");
        // expect(s2s(43)).toBe(43);
        expect(s2s(1, {format: "long"})).toBe("1 second");
    });

    test("returns expected results on zero condition", () => {
        expect(s2h(0, {format: "long"})).toBe("0 hours");
        expect(s2h(0, {format: "short"})).toBe("0 h");
    });
});