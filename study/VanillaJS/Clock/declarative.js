const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (msg) => console.log(msg);
const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((composed, f) => f(composed), arg);

// Date 객체를 받아서 시, 분, 초가 들어 있는 24시간제 시간을 반환한다.
const abstractClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

// 24시간제 시간을 받아서 상용시로 변경한다. ex) 13은 1
const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});

// 24시간제 시간을 받아서 시간에 맞는 AM이나 PM을 붙여준다.
const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM",
});

// 대상 함수를 인자로 받아서 시간을 그 함수에게 전환하는 함수를 반환한다. 예제에서는 대상 함수로 console.log를 사용한다.
const display = (target) => (time) => target(time);

// 템플릿 문자열을 받아서 그 문자열이 지정하는 형식대로 시간을 표현하는 문자열을 반환한다. 예제에서는 'hh:mm:ss tt'를 템플릿으로 사용한다.
const formatClock = (format) => (time) => {
  return format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);
};

// 키와 객체를 인자로 받아서 객체에서 그 키에 해당하는 프로퍼티 값이 9 이하인 경우 앞에 0을 붙인 문자열을 반환하고
// 10 이상인 경우 그냥 그 값에 해당하는 문자열을 반환한다.
const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key],
});

// 24시간제 시간을 받아서 상용시로 변경한다.
const converToCivilianTime = (clockTime) =>
  compose(appendAMPM, civilianHours)(clockTime);

// 상용시 객체를 받아서 시, 분, 초가 두자리 숫자로 이뤄졌는지 확인하고 필요하면 앞에 0을 붙여준다.
const doubleDigits = (civilianTime) =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);

// 매 초 호출되는 인터벌 타이머를 설정해서 시계를 시작한다.
// 타이머의 콜백은 우리가 만든 여러 함수를 합성한 함수이다. 매 초 콘솔을 지우고, 현재 시간을 얻엇 ㅓ변환한 다음에 상용시로 바꾸고
// 형식에 맞는 문자열을 만들어서 출력한다.
const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      abstractClockTime,
      converToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(log)
    ),
    oneSecond()
  );

startTicking();
