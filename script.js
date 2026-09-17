/* =========================================================
   CHRONOLUX 5.0
   Premium Precision Clock Engine
========================================================= */

const root = document.documentElement;


/* =========================================================
   DOM
========================================================= */

const ticksContainer = document.getElementById("ticks");
const numbersContainer = document.getElementById("numbers");

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

const secondOrbitDot =
    document.getElementById("secondOrbitDot");

const digitalTime =
    document.getElementById("digitalTime");

const period =
    document.getElementById("period");

const milliseconds =
    document.getElementById("milliseconds");

const dayName =
    document.getElementById("dayName");

const dateValue =
    document.getElementById("dateValue");

const secondProgress =
    document.getElementById("secondProgress");

const secondValue =
    document.getElementById("secondValue");

const cycleText =
    document.getElementById("cycleText");

const modeText =
    document.getElementById("modeText");

const hexColor =
    document.getElementById("hexColor");

const spectrumDot =
    document.querySelector(".spectrum-dot");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");


/* =========================================================
   COLOR ENGINE
========================================================= */

/*
   Every second gets a different color.

   We deliberately use visually attractive neon colors
   instead of completely random RGB values.
*/

const SECOND_COLORS = [
    "#00F5D4",
    "#00E5FF",
    "#38BDF8",
    "#60A5FA",
    "#818CF8",
    "#A78BFA",
    "#C084FC",
    "#E879F9",
    "#F472B6",
    "#FB7185",
    "#FB923C",
    "#FACC15",
    "#A3E635",
    "#4ADE80",
    "#2DD4BF",
    "#22D3EE"
];


/*
   Minute palette.
*/
const MINUTE_COLORS = [
    "#00F5D4",
    "#22D3EE",
    "#38BDF8",
    "#6366F1",
    "#8B5CF6",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
    "#F97316",
    "#EAB308",
    "#84CC16",
    "#10B981"
];


/*
   Hour palette.
*/
const HOUR_COLORS = [
    "#00F5D4",
    "#06B6D4",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
    "#F97316",
    "#EAB308",
    "#22C55E"
];


/* =========================================================
   COLOR HELPERS
========================================================= */

function setAccent(color) {

    root.style.setProperty("--accent", color);

    root.style.setProperty(
        "--accent-soft",
        hexToRgba(color, 0.16)
    );

    root.style.setProperty(
        "--accent-strong",
        hexToRgba(color, 0.42)
    );

    if (hexColor) {
        hexColor.textContent = color;
    }

    if (spectrumDot) {
        spectrumDot.style.backgroundColor = color;
        spectrumDot.style.boxShadow =
            `0 0 10px ${color}`;
    }
}


function hexToRgba(hex, alpha) {

    const clean = hex.replace("#", "");

    const r =
        parseInt(clean.substring(0, 2), 16);

    const g =
        parseInt(clean.substring(2, 4), 16);

    const b =
        parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/* =========================================================
   CREATE CLOCK TICKS ONCE
========================================================= */

function createTicks() {

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < 60; i++) {

        const tick =
            document.createElement("div");

        tick.className = "tick";

        if (i % 5 === 0) {
            tick.classList.add("major");
        }

        const angle = i * 6;

        tick.style.transform =
            `translate(-50%, -50%) rotate(${angle}deg) translateY(-${getTickRadius()}px)`;

        fragment.appendChild(tick);
    }

    ticksContainer.appendChild(fragment);
}


function getTickRadius() {

    const clock =
        document.querySelector(".clock");

    if (!clock) return 200;

    return clock.clientWidth * 0.427;
}


/* =========================================================
   CREATE NUMBERS ONCE
========================================================= */

function createNumbers() {

    const fragment =
        document.createDocumentFragment();

    for (let number = 1; number <= 12; number++) {

        const element =
            document.createElement("div");

        element.className = "number";

        element.textContent = number;

        const angle =
            number * 30;

        element.style.setProperty(
            "--angle",
            `${angle}deg`
        );

        element.style.setProperty(
            "--number-radius",
            `${getNumberRadius()}`
        );

        element.dataset.number = number;

        fragment.appendChild(element);
    }

    numbersContainer.appendChild(fragment);
}


function getNumberRadius() {

    const clock =
        document.querySelector(".clock");

    if (!clock) return 150;

    return clock.clientWidth * 0.37;
}


/* =========================================================
   TIME FORMAT
========================================================= */

function pad(number, length = 2) {

    return String(number).padStart(length, "0");
}


function getIndiaTime() {

    const now = new Date();

    /*
       Browser time converted to Asia/Kolkata.
    */

    const formatter =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );

    const parts =
        formatter.formatToParts(now);

    const values = {};

    parts.forEach(part => {
        if (part.type !== "literal") {
            values[part.type] = part.value;
        }
    });

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),

        hour: Number(values.hour),
        minute: Number(values.minute),
        second: Number(values.second),

        weekday: values.weekday
    };
}


/* =========================================================
   DATE
========================================================= */

const MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
];


/* =========================================================
   ACTIVE NUMBER
========================================================= */

function updateActiveNumber(hour) {

    const hour12 =
        hour % 12 || 12;

    const numbers =
        document.querySelectorAll(".number");

    numbers.forEach(number => {

        const value =
            Number(number.dataset.number);

        number.classList.toggle(
            "active",
            value === hour12
        );
    });
}


/* =========================================================
   SECOND TICKS
========================================================= */

function updateTickHighlight(second) {

    const ticks =
        document.querySelectorAll(".tick");

    ticks.forEach((tick, index) => {

        tick.classList.toggle(
            "active",
            index === second
        );
    });
}


/* =========================================================
   COLOR CHANGE
========================================================= */

let previousSecond = -1;
let previousMinute = -1;
let previousHour = -1;


/*
   SECOND:
   Changes every second.
*/
function updateSecondColor(second) {

    const color =
        SECOND_COLORS[second % SECOND_COLORS.length];

    setAccent(color);
}


/*
   MINUTE:
   Different palette when minute changes.
*/
function updateMinuteColor(minute) {

    const color =
        MINUTE_COLORS[minute % MINUTE_COLORS.length];

    root.style.setProperty(
        "--minute-accent",
        color
    );

    /*
       Small visual accent.
    */
    minuteHand.style.boxShadow =
        `0 0 12px ${hexToRgba(color, .45)}`;
}


/*
   HOUR:
   Hour changes get their own visual transition.
*/
function updateHourColor(hour) {

    const color =
        HOUR_COLORS[hour % HOUR_COLORS.length];

    root.style.setProperty(
        "--hour-accent",
        color
    );

    hourHand.style.boxShadow =
        `0 0 13px ${hexToRgba(color, .4)}`;
}


/* =========================================================
   CLOCK UPDATE
========================================================= */

function updateClock() {

    const now =
        new Date();

    const time =
        getIndiaTime();

    const hour =
        time.hour;

    const minute =
        time.minute;

    const second =
        time.second;

    const ms =
        now.getMilliseconds();


    /* =========================================
       SMOOTH ANGLES
    ========================================= */

    const smoothSecond =
        second + ms / 1000;

    const smoothMinute =
        minute +
        smoothSecond / 60;

    const smoothHour =
        (hour % 12) +
        smoothMinute / 60;


    const secondAngle =
        smoothSecond * 6;

    const minuteAngle =
        smoothMinute * 6;

    const hourAngle =
        smoothHour * 30;


    /* =========================================
       HANDS
    ========================================= */

    hourHand.style.transform =
        `rotate(${hourAngle}deg)`;

    minuteHand.style.transform =
        `rotate(${minuteAngle}deg)`;

    secondHand.style.transform =
        `rotate(${secondAngle}deg)`;


    /* =========================================
       ORBIT DOT
    ========================================= */

    secondOrbitDot.style.transform =
        `translate(-50%, -50%)
         rotate(${secondAngle}deg)
         translateY(calc(var(--clock-size) * -0.455))`;


    /* =========================================
       DIGITAL CLOCK
    ========================================= */

    let hour12 =
        hour % 12 || 12;

    digitalTime.textContent =
        `${pad(hour12)}:${pad(minute)}:${pad(second)}`;


    period.textContent =
        hour >= 12 ? "PM" : "AM";


    milliseconds.textContent =
        pad(ms, 3);


    /* =========================================
       DATE
    ========================================= */

    dayName.textContent =
        time.weekday.toUpperCase();

    dateValue.textContent =
        `${pad(time.day)} ${MONTHS[time.month - 1]} ${time.year}`;


    /* =========================================
       SECOND DATA
    ========================================= */

    secondValue.textContent =
        second;

    cycleText.textContent =
        `${second} / 60`;

    secondProgress.style.width =
        `${((second + ms / 1000) / 60) * 100}%`;


    /* =========================================
       HOUR MODE
    ========================================= */

    modeText.textContent =
        `HOUR ${pad(hour)}`;


    /* =========================================
       COLOR CHANGES
    ========================================= */

    if (second !== previousSecond) {

        previousSecond =
            second;

        updateSecondColor(
            second
        );

        updateTickHighlight(
            second
        );
    }


    if (minute !== previousMinute) {

        previousMinute =
            minute;

        updateMinuteColor(
            minute
        );
    }


    if (hour !== previousHour) {

        previousHour =
            hour;

        updateHourColor(
            hour
        );

        updateActiveNumber(
            hour
        );
    }
}


/* =========================================================
   RESPONSIVE GEOMETRY
========================================================= */

function updateGeometry() {

    const tickRadius =
        getTickRadius();

    const numberRadius =
        getNumberRadius();


    document
        .querySelectorAll(".tick")
        .forEach((tick, index) => {

            const angle =
                index * 6;

            tick.style.transform =
                `translate(-50%, -50%)
                 rotate(${angle}deg)
                 translateY(-${tickRadius}px)`;
        });


    document
        .querySelectorAll(".number")
        .forEach(number => {

            const value =
                Number(number.dataset.number);

            const angle =
                value * 30;

            number.style.setProperty(
                "--number-radius",
                numberRadius
            );

            number.style.transform =
                `rotate(${angle}deg)
                 translateY(-${numberRadius}px)
                 rotate(${-angle}deg)`;
        });
}


/* =========================================================
   FULLSCREEN
========================================================= */

fullscreenBtn.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();
            }

        } catch (error) {

            console.warn(
                "Fullscreen unavailable:",
                error
            );
        }
    }
);


/* =========================================================
   START
========================================================= */

function initialize() {

    createTicks();

    createNumbers();

    updateGeometry();

    updateClock();

    /*
       60 FPS display loop.

       IMPORTANT:
       We do NOT rebuild HTML every frame.
       Only CSS transforms/text values are updated.
    */

    function frame() {

        updateClock();

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);

        resizeTimer =
            setTimeout(
                updateGeometry,
                100
            );
    }
);


/* =========================================================
   BOOT
========================================================= */

initialize();