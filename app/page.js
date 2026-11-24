"use client";
import { useState } from "react";

const TOPICS = ["연애·결혼", "궁합", "직업·커리어", "재물", "학업·시험", "신년 운세", "개인 고민"];
const EL = ["목", "화", "토", "금", "수"];

export default function Home() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [noTime, setNoTime] = useState(false);
  const [calendar, setCalendar] = useState("solar");
  const [gender, setGender] = useState("여자");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [res, setRes] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setRes(null);
    try {
      const r = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: noTime ? "" : time, calendar }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error); else setRes(data);
    } catch { setError("연결에 실패했어요. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  }

  const P = res && [["시", res.pillars.hour], ["일", res.pillars.day], ["월", res.pillars.month], ["년", res.pillars.year]];

  return (
    <main>
      <h1>태어난 날이 말해주는<br />지금의 나</h1>
      <p className="lead">생년월일만 넣으면 사주 원국과 오행을 바로 확인할 수 있어요.</p>
      <form onSubmit={submit}>
        <div className="lab">궁금한 주제</div>
        <div className="chips">
          {TOPICS.map((t) => (
            <button type="button" key={t} className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
          ))}
        </div>
        <label htmlFor="n">이름</label>
        <input id="n" value={name} onChange={(e) => setName(e.target.value)} required />
        <label htmlFor="d">생년월일</label>
        <input id="d" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label htmlFor="c">달력</label>
        <select id="c" value={calendar} onChange={(e) => setCalendar(e.target.value)}>
          <option value="solar">양력</option><option value="lunar">음력</option><option value="leap">음력 (윤달)</option>
        </select>
        <label htmlFor="t">태어난 시간</label>
        <input id="t" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={noTime} required={!noTime} />
        <label className="check"><input type="checkbox" checked={noTime} onChange={(e) => setNoTime(e.target.checked)} />태어난 시간을 몰라요</label>
        <div className="lab">성별</div>
        <div className="chips">
          {["여자", "남자"].map((g) => (
            <button type="button" key={g} className="chip" aria-pressed={gender === g} onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
        <button className="go" disabled={loading}>{loading ? "계산 중…" : "내 사주 무료로 보기"}</button>
        {error && <p className="err" role="alert">{error}</p>}
      </form>

      {res && (
        <section className="result">
          <h2 style={{ fontFamily: "Noto Serif KR", margin: "0 0 14px" }}>{name || "당신"}님의 사주 원국</h2>
          <div className="pillars">
            {P.map(([k, p]) => (
              <div className="pillar" key={k}>
                <small>{k}주</small>
                {p ? <><b>{p.stem}</b><b>{p.branch}</b><small>{p.hanja}</small></> : <><b>?</b><b>?</b><small>시간 모름</small></>}
              </div>
            ))}
          </div>
          <p><b>일간 {res.dayMaster}</b> — {res.dayMasterText}</p>
          <div className="bars">
            {EL.map((e) => (
              <div className="bar" key={e}>
                <span>{e}</span>
                <span className="track"><span className="fill" style={{ display: "block", width: `${(res.count[e] / 8) * 100}%`, background: `var(--${e})` }} /></span>
                <span>{res.count[e]}</span>
              </div>
            ))}
          </div>
          <div className="lock">“{topic}” 상세 리포트는 다음 단계에서 연결됩니다. (결제 + AI 풀이)</div>
        </section>
      )}
      <p className="note">본 콘텐츠는 오락·참고용이며 중요한 결정의 책임은 본인에게 있습니다.</p>
    </main>
  );
}
