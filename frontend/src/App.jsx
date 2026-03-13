import { useState } from "react";
import axios from "axios";

const TOPICS = ["Artificial Intelligence", "Fintech", "Startups", "Web Dev", "Science", "Robotics", "Cybersecurity", "Blockchain"];

const HEADLINES = [
  "OpenAI releases new reasoning model",
  "Nigerian fintech raises $40M Series B",
  "Robotics startup disrupts logistics",
  "Web Dev trends reshaping 2026",
];

export default function App() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const toggleTopic = (topic) => {
    setSelected(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSend = async () => {
    if (!email) return setStatus({ type: "error", msg: "An email address is required." });
    if (selected.length === 0) return setStatus({ type: "error", msg: "Select at least one topic." });
    setLoading(true);
    setStatus(null);
    try {
      await axios.post("http://127.0.0.1:5000/send-digest", { email, topics: selected });
      setStatus({ type: "success", msg: "✓ Digest sent! Check your inbox." });
    } catch {
      setStatus({ type: "error", msg: "Could not reach the server." });
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0EBE3",
      display: "flex",
      fontFamily: "'Outfit', sans-serif",
    }}>

     {/* Left panel */}
      <div style={{
        width: "44%",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #1C1812 0%, #2A2218 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "52px 48px",
        borderRadius: "0 24px 24px 0"
      }}>

        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(196,146,42,0.12)",
            border: "1px solid rgba(196,146,42,0.25)",
            padding: "7px 16px",
            borderRadius: 100,
            marginBottom: 166
          }}>
{/*             <div style={{ */}
{/*               width: 7, height: 7, borderRadius: "50%", */}
{/*               background: "#C4922A", */}
{/*               boxShadow: "0 0 8px rgba(196,146,42,0.6)" */}
{/*             }} /> */}
            <span style={{
              fontSize: 11, letterSpacing: 3,
              color: "#C4922A", textTransform: "uppercase", fontWeight: 500
            }}>Daily · Free</span>
          </div>

          {/* Brand */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 64, fontWeight: 400,
            color: "#F5EFE4", lineHeight: 1,
            margin: "0 0 28px"
          }}>
            Sci<span style={{ fontStyle: "italic", color: "#C4922A" }}>Innovate</span>
          </h1>

          <div style={{ width: 36, height: 2, background: "#C4922A", marginBottom: 28 }} />

          <p style={{
            fontSize: 16, color: "#8A8070",
            lineHeight: 1.9, maxWidth: 260,
            textAlign: "center",
            marginLeft: 54,
            marginTop: 50
          }}>
            The smartest tech and science stories, curated and delivered to your inbox every morning.
          </p>
        </div>

        <p style={{
          fontSize: 10, letterSpacing: 4,
          color: "#3A3428", textTransform: "uppercase"
        }}>
          SciInnovate · Stay Curious
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "56px 64px"
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 34, fontWeight: 400,
            color: "#1C1812", margin: "0 0 8px"
          }}>
            Get your digest
          </h2>
          <p style={{
            fontSize: 14, color: "#9A9080",
            marginBottom: 44, lineHeight: 1.6
          }}>
            Pick your interests and we'll curate the perfect morning read.
          </p>

          {/* Email */}
          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: "block", fontSize: 11,
              letterSpacing: 3, textTransform: "uppercase",
              color: "#1C1812", marginBottom: 10, fontWeight: 500
            }}>Your email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: `2px solid ${focused ? "#C4922A" : "#E0D8CE"}`,
                borderRadius: 12,
                padding: "14px 18px",
                fontSize: 15,
                color: "#1C1812",
                fontFamily: "'Outfit', sans-serif",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          {/* Topics */}
          <div style={{ marginBottom: 36 }}>
            <label style={{
              display: "block", fontSize: 11,
              letterSpacing: 3, textTransform: "uppercase",
              color: "#1C1812", marginBottom: 14, fontWeight: 500
            }}>
              Topics {selected.length > 0 &&
                <span style={{ color: "#C4922A", fontWeight: 400 }}>· {selected.length} selected</span>
              }
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {TOPICS.map(topic => {
                const active = selected.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: "9px 18px",
                      background: active ? "#1C1812" : "#FFFFFF",
                      border: `2px solid ${active ? "#1C1812" : "#E0D8CE"}`,
                      borderRadius: 100,
                      color: active ? "#F5EFE4" : "#6A6058",
                      fontSize: 12,
                      letterSpacing: 0.5,
                      cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: active ? 500 : 400,
                      transition: "all 0.15s"
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          {status && (
            <div style={{
              background: status.type === "success" ? "rgba(196,146,42,0.1)" : "rgba(192,80,80,0.1)",
              border: `1px solid ${status.type === "success" ? "rgba(196,146,42,0.3)" : "rgba(192,80,80,0.3)"}`,
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20
            }}>
              <p style={{
                fontSize: 13,
                color: status.type === "success" ? "#C4922A" : "#C05050",
                margin: 0
              }}>
                {status.msg}
              </p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              width: "100%",
              padding: "17px 0",
              background: loading ? "#E0D8CE" : "#C4922A",
              border: "none",
              borderRadius: 12,
              color: loading ? "#9A9080" : "#1C1812",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(196,146,42,0.3)"
            }}
          >
            {loading ? "Sending..." : "Send Today's Digest →"}
          </button>

          <p style={{
            fontSize: 12, color: "#B0A898",
            marginTop: 18, textAlign: "center"
          }}>
            Free forever · No spam · Unsubscribe anytime
          </p>

        </div>
      </div>

    </div>
  );
}