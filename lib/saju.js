const L = require("lunar-javascript");

const S = "甲乙丙丁戊己庚辛壬癸".split("");
const SK = "갑을병정무기경신임계".split("");
const SE = ["목","목","화","화","토","토","금","금","수","수"];
const B = "子丑寅卯辰巳午未申酉戌亥".split("");
const BK = "자축인묘진사오미신유술해".split("");
const BE = ["수","토","목","목","토","화","화","토","금","금","토","수"];

export const DAY_MASTER = {
  갑: "곧게 뻗는 큰 나무. 앞장서서 길을 여는 개척형입니다.",
  을: "바위틈에서도 자라는 풀꽃. 부드럽지만 끈질기게 적응합니다.",
  병: "한낮의 태양. 밝고 솔직하며 존재감이 큽니다.",
  정: "어둠을 밝히는 촛불. 섬세하고 정이 깊습니다.",
  무: "넓은 대지의 큰 산. 듬직하고 신뢰를 주는 타입입니다.",
  기: "곡식을 키우는 논밭. 현실적이고 사람을 잘 품습니다.",
  경: "단단한 바위와 쇠. 결단이 빠르고 의리가 있습니다.",
  신: "빛나는 보석. 예민한 안목과 완벽주의가 강점입니다.",
  임: "넓은 강과 바다. 생각이 크고 흐름을 읽는 전략가입니다.",
  계: "스며드는 빗물. 통찰력이 깊고 감수성이 풍부합니다.",
};

function parse(p) {
  const s = S.indexOf(p[0]);
  const b = B.indexOf(p[1]);
  return { hanja: p, stem: SK[s], branch: BK[b], stemEl: SE[s], branchEl: BE[b] };
}

export function calcSaju({ year, month, day, hour, minute, hasTime, calendar }) {
  const h = hasTime ? hour : 12;
  const mi = hasTime ? minute : 0;
  const lunar =
    calendar === "solar"
      ? L.Solar.fromYmdHms(year, month, day, h, mi, 0).getLunar()
      : L.Lunar.fromYmdHms(year, calendar === "leap" ? -month : month, day, h, mi, 0);
  const ec = lunar.getEightChar();
  const pillars = {
    hour: hasTime ? parse(ec.getTime()) : null,
    day: parse(ec.getDay()),
    month: parse(ec.getMonth()),
    year: parse(ec.getYear()),
  };
  const count = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  Object.values(pillars).forEach((p) => {
    if (p) { count[p.stemEl]++; count[p.branchEl]++; }
  });
  return { pillars, count, dayMaster: pillars.day.stem, dayMasterText: DAY_MASTER[pillars.day.stem] };
}
