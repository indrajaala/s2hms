interface s2hmsOptions {
    format?: "standard" | "long" | "short",
    separator?: string
}

interface s2hmOptions {
    format?: "standard" | "long" | "short",
    fallback?: boolean,
}

const s2hms = (seconds: number, options?: s2hmsOptions) => {
    const defaults: s2hmsOptions = {
        format: "standard",
        separator: ":",
    };

    options = {...defaults, ...options};
    const {format, separator} = options;
    const formats = {
        short: ["h", "m", "s"],
        long: ["hour", "minute", "second"],
        standard: ["", "", ""],
    };

    const time = [
        Math.floor(seconds / 60 / 60),
        Math.floor((seconds / 60) % 60),
        Math.floor(seconds % 60),
    ];

    const setPostFix = (unit: number, zeroValCount: number) => {
        if (format === "long" && unit > 1 || format === "long" && zeroValCount === 3) {
            return "s";
        } else {
            return ""
        }
    }

    const timeString = () => {
        let hms: string[] = []
        let zeroValCount = 0;
        time.forEach((t, index) => {
            if (t === 0) {
                zeroValCount += 1;
            }
            const val = format !== "standard" && zeroValCount === 3 ? `${t}` : `${t}`.padStart(2, "0");
            const formatString = formats[format][index];
            const postFix = setPostFix(t, zeroValCount);
            if (format !== "standard" && t === 0 && zeroValCount !== 3 ) {
                return;
            } else {
                hms.push(`${val}${formatString}${postFix}`)
            }
        })
        return hms.join(separator)
    }
    return timeString()
}

const makeExplicitTimeUnit = (seconds: number, mode: string, options: s2hmOptions, fallbackFunction?: (seconds: number, options: s2hmOptions) => string) => {
    const {format, fallback} = options;
    const formats: { [key: string]: { [key: string]: string } } = {
        hours: {short: "h", long: "hour", standard: ""},
        minutes: {short: "m", long: "minute", standard: ""},
        seconds: {short: "s", long: "second", standard: ""}
    }

    const time: { [key: string]: string | number } = {
        hours: (seconds / 3600).toFixed(1),
        minutes: (seconds / 60).toFixed(1),
        seconds: seconds
    }

    const setPostFix = (time: number | string): string => {
        return format === "long" && time !== 1 ? "s" : "";
    };

    const val = time[mode] === "0.0" ? "0" : time[mode];
    const formatString = format !== "standard" ? ` ${formats[mode][format]}` : "";
    const postFix = setPostFix(val);
    if (fallback === true && format === "standard") {
        throw new Error(
            `option'fallback:true' can only be used when a format is specified other than default standard`
        );
    } else if (fallback === true && fallbackFunction && val < 1) {
        return fallbackFunction(seconds, {format: format, fallback: fallback});
    } else {
        return `${val}${formatString}${postFix}`
    }
}

const s2h = (seconds: number, options?: s2hmOptions) => {
    const defaults: s2hmOptions = {
        format: "standard",
        fallback: false,
    }
    options = {...defaults, ...options};
    return makeExplicitTimeUnit(seconds, "hours", options, s2m)
}

const s2m = (seconds: number, options?: s2hmOptions) => {
    const defaults: s2hmOptions = {
        format: "standard",
        fallback: false
    }
    options = {...defaults, ...options};
    return makeExplicitTimeUnit(seconds, "minutes", options, s2s)
}

const s2s = (seconds: number, options?: s2hmOptions) => {
    const defaults: s2hmOptions = {
        format: "standard",
        fallback: false
    }
    options = {...defaults, ...options};
    return makeExplicitTimeUnit(seconds, "seconds", options)
}

export {s2hms, s2h, s2m, s2s}