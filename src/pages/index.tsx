import Aphrodite from "../../aphrodite/aphrodite";

export default function IndexPage() {
  return (
    <div>
      <p style={{
        height: "100%", width: "100%", position: "fixed", top: 0, left: 0,
        textAlign: "center", lineHeight: "300px", fontSize: "30px"
      }}>
        Welcome use Aphrodite!
      </p>
      <p style={{
        height: "100%", width: "100%", position: "fixed", top: 0, left: 0,
        textAlign: "center", lineHeight: "400px", fontSize: "16px", cursor: "pointer", color: "#A0A0A0"
      }} onClick={function () {
        window.location.href = "/editor"
      }}>
        {"Go to Editor >>"}
      </p>
    </div>
  )
}
