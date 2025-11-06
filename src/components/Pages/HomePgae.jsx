import { memo } from "react"
import "./homePage.css";

function HomePage () {
    return <>
    <div className="home-page">
        <section className="home-hero">
            <h1 className="home-hero__title">What is BABEL?</h1>
            <h2>Finish after LLM translate backend is implemented (I don't know whither all functions could be implemented as expected)</h2>
        </section>
    </div>
    </>
}

export default memo(HomePage);
