import { useEffect, useState } from "react";
import "./animation.css";
import cover1 from "../assets/cover2.jpg"

export default function Cover({ onStart, introComplete = false }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (introComplete) {
      setExiting(true);
    }
  }, [introComplete]);

  const handleStart = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      onStart?.();
    }, 500);
  };

  return (
    <div className={`background ${exiting ? "cover-exit" : ""}`}>
      <img src={cover1} alt="background(Tower of Babel, by Pieter Bruegel the Elder)" className="bg" />
      <div className="overlay"></div>

      <div
        className={`content ${visible ? "content-visible" : ""} ${
          exiting ? "content-exit" : ""
        }`}
      >
        <div className="hline main-hline"></div>
        <p className="serif-text welcome-text content-line">WELCOME TO</p>
        <h1 className="content-line delay title-highlight">BABEL</h1>
        <p className="serif-text intro-text content-line delay-intro">
          A file translation web based on LLM
        </p>
        <div className="hline main-hline"></div>
        <div className="line connector-line"></div>
        <button
          className="start-btn content-line delay-cta"
          type="button"
          onClick={handleStart}
        >
          Start
        </button>
        <div className="quotation content-line delay-quote">
          <p>
            <span className="quote-line">
              “Come, let us build ourselves a city, with a tower that reaches to the heavens, so that we
            </span>
            <span className="quote-line">
              may make a name for ourselves; otherwise we will be scattered over the face of the earth.”
            </span>
          </p>
          <span>— Genesis 11:1-9</span>
        </div>
        <div className="hline bottom-hline"></div>
      </div>
    </div>
  )
}
