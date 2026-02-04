import React, { useState, useEffect } from "react";
import api from "./api";
import {
  FaRegSun,
  FaMoon,
  FaTrash,
  FaSignOutAlt,
  FaLink,
  FaCopy
} from "react-icons/fa";

document.body.style.margin = "0";
if (window.innerWidth > 600) {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}



export default function App() {
  const isMobile = window.innerWidth <= 600;
  const [darkMode, setDarkMode] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [myUrls, setMyUrls] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { checkSession(); }, []);

  // ================= AUTH =================

const signup = async () => {

  if(!email || !password){
    alert("Please fill all fields");
    return;
  }

  try {
    await api.post("/auth/signup", { email, password });
    alert("Signup successful! Login now.");
    setIsSignup(false);
  } catch {
    alert("User already exists");
  }
};


const login = async () => {

  if(!email || !password){
    alert("Please fill all fields");
    return;
  }

  try {
    await api.post("/auth/login", { email, password });
    setLoggedIn(true);
    loadMyUrls();
  } catch (err) {

    if(err.response?.data?.error === "wrong_password"){
      alert("Incorrect password");
    } else {
      alert("Invalid credentials");
    }

  }
};


  const logout = async () => {
    await api.post("/auth/logout");
    setLoggedIn(false);
    setMyUrls([]);
  };
  const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};


  // ================= URL =================
  const send = async () => {

  if (!url.trim()) {
    alert("Please insert a URL");
    return;
  }

  let finalUrl = url.trim();

  // auto add https if missing
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    finalUrl = "https://" + finalUrl;
  }

  if (!isValidUrl(finalUrl)) {
    alert("Please enter a valid URL");
    return;
  }

  if (!expiry) {
    alert("Please select expiry date");
    return;
  }

  await api.post("/shorten", {
    originalUrl: finalUrl,
    expiry
  });

  setUrl("");
  setExpiry("");
  loadMyUrls();
};

  const loadMyUrls = async () => {
    const r = await api.get("/myurls");
    setMyUrls(r.data || []);
  };

  const checkSession = async () => {
    try {
      const r = await api.get("/myurls");
      if (Array.isArray(r.data)) {
        setLoggedIn(true);
        setMyUrls(r.data);
      }
    } catch {}
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(
  `${import.meta.env.VITE_API_URL}/${code}`
  );
    alert("Copied!");
  };

  const timeLeft = (t) => {
    if (!t) return "Never expires";
    const diff = new Date(t) - new Date();
    if (diff <= 0) return "Expired";

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days} days left`;
    if (hrs > 0) return `${hrs} hours left`;
    return `${mins} mins left`;
  };

  // ================= STYLES =================

  const page = {
  height: "100vh",
  width: "100vw",
  background: darkMode ? "#0b1220" : "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  boxSizing: "border-box",
  overflow: "hidden"
};

  

  const dashboardCard = {
    width: "100%",
    maxHeight: "90vh",
    maxWidth: 700,
    background: darkMode ? "#020617" : "#fff",
    borderRadius: 24,
    padding: isMobile ? 20 : 32,
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
    color: darkMode ? "#f8fafc" : "#0f172a"
  };

  const contentWrap = {
    maxWidth: 720,
    margin: "0 auto"
  };

  const authCard = {
  width: "100%",
  maxWidth: 700,
  background: darkMode ? "#020617" : "#fff",
  borderRadius: 24,
  padding: 32,
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  color: darkMode ? "#f8fafc" : "#0f172a"
};

const input = {
  padding: 15,
  borderRadius: 10,
  border: darkMode
    ? "1px solid #cbd5e1"               
    : "1px solid #000",                
  fontSize: 14,
  outline: "none",
  width: isMobile ? "100%" : "60%",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
};




  const btn = {
    padding: "12px 26px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    maxWidth:220
  };

const iconBtn = (darkMode) => ({
  background: darkMode ? "#f1f5f9" : "#e5e7eb",
  border: "none",
  padding: isMobile ? 10 : 16,
  width: isMobile ? 44 : 60,
  height: isMobile ? 40 : 52,
  borderRadius: 16,
  cursor: "pointer",
  fontSize: isMobile ? 14 : 18,
  lineHeight: 1,  
  boxShadow: "0 10px 22px rgba(0,0,0,0.2)",
  transition: "0.2s"
});

const logoutBtn = {
  background:"#ef4444",
  color:"#fff",
  border:"none",
  padding: isMobile ? "10px 14px" : "14px 18px",
  borderRadius:16,
  cursor:"pointer",
  fontSize: isMobile ? 14 : 20,
  lineHeight: 1, 
  boxShadow:"0 8px 18px rgba(0,0,0,0.25)"
};

const smallIconBtn = (darkMode) => ({
  background: darkMode ? "#f1f5f9" : "#e5e7eb",
  border: "none",
  padding: isMobile ? 8 : 12,
  width: isMobile ? 36 : 48,
  height: isMobile ? 34 : 44,
  borderRadius: 12,
  cursor: "pointer",
  fontSize: isMobile ? 12 : 16,
  lineHeight: 1,
  boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
  transition: "0.2s"
});


  // ================= AUTH UI =================

  if(!loggedIn){
  return(
    <div style={page}>
      <div style={authCard}>

        <h2 style={{ textAlign:"center", marginBottom:24 }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {/* CENTERED FIELDS */}
        <div
          style={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center"
          }}
        >

          <input
            placeholder="Email"
            style={{ ...input, marginBottom:14, width: isMobile ? "100%" : "75%" }}
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={{ ...input, marginBottom:22, width: isMobile ? "100%" : "75%"}}
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />

          <button
            onClick={isSignup ? signup : login}
            style={{
              ...btn,
              background:"#6366f1",
              color:"#fff",
              width: isMobile ? "100%" : "45%",
              marginBottom:18
            }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

        </div>

        {/* SWITCH TEXT */}
        <div style={{ textAlign:"center", fontSize:14 }}>
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <span
                style={{ color:"#6366f1", cursor:"pointer" }}
                onClick={()=>setIsSignup(false)}
              >
                Login
              </span>
            </span>
          ) : (
            <span>
              Don’t have an account?{" "}
              <span
                style={{ color:"#6366f1", cursor:"pointer" }}
                onClick={()=>setIsSignup(true)}
              >
                Sign up
              </span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}


  // ================= DASHBOARD =================

  return(
    <div style={page}>
      <div style={dashboardCard}>

        <div style={contentWrap}>

          {/* HEADER */}
         <div style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            flexWrap:"nowrap",
            marginBottom: isMobile ? 18 : 28,
            gap: 8
          }}>

            <h1 style={{
              margin:0,
              fontSize: isMobile ? 16 : 32,
              lineHeight: isMobile ? "28px" : "normal"
            }}>
              URL Shortener Dashboard
            </h1>


            <div style={{display:"flex",gap:12}}>
                  <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  ...iconBtn(darkMode),
                  background: darkMode ? "#f1f5f9" : "#facc15"
                }}
              >
                {darkMode ? <FaMoon /> : <FaRegSun />}
              </button>



              <button onClick={logout} style={logoutBtn}>
                <FaSignOutAlt/>
              </button>
            </div>
          </div>

          {/* INPUT ROW */}
          <div style={{
            display:"flex",
            gap:14,
            marginBottom:18,
            flexWrap:"wrap"
          }}>

            <input
              placeholder="Paste long URL..."
              value={url}
              onChange={e=>setUrl(e.target.value)}
              style={{...input,flex:1}}
            />
          <select
            value={expiry}
            onChange={e=>setExpiry(e.target.value)}
           style={{...input, width: isMobile ? "100%" : 160}}

          >

            <option value="" disabled>
              Expiry Date
            </option>

            <option value="10min">10 Minutes</option>
            <option value="1hour">1 Hour</option>
            <option value="1day">1 Day</option>
            <option value="7days">7 Days</option>
            <option value="never">Never</option>

          </select>



          </div>

          {/* SHORTEN BUTTON */}
          <div style={{textAlign:"center",marginBottom:36}}>
            <button onClick={send} style={{...btn,background:"#6366f1",color:"#fff"}}>
              Shorten URL
            </button>
          </div>

          {/* MY LINKS CARD */}
          <div style={{
            padding:28,
            borderRadius:20,
            border: darkMode ? "1px solid #fff" : "1px solid #000",
            background: darkMode ? "#020617" : "#fff",
            boxShadow:"0 10px 30px rgba(0,0,0,0.15)"
          }}>

            <h2 style={{marginBottom:20}}>My Links</h2>

            {myUrls.length===0 && <p>No links yet</p>}

            <div style={{maxHeight:300,overflowY:"auto"}}>

              {myUrls.map(u=>(
                <div key={u._id} style={{
                  border: darkMode ? "1px solid #fff" : "1px solid #000",
                  padding:14,
                  borderRadius:12,
                  marginBottom:12,
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center"
                }}>

                  <div>
                  <a
  href={`${import.meta.env.VITE_API_URL}/${u.shortCode}`}
  target="_blank"
  style={{
    display: "flex",
    gap: 6,
    color: darkMode ? "#60a5fa" : "#2563eb",   // blue shades
    textDecoration: "none",
    fontWeight: 600,
    fontSize: isMobile ? 14 : 16
  }}
>

                      <FaLink/>/{u.shortCode}
                    </a>

                    <small>{u.clicks} clicks • {timeLeft(u.expireAt)}</small>
                  </div>

                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>copyLink(u.shortCode)} style={smallIconBtn(darkMode)}>
                      <FaCopy/>
                    </button>

                    <button
                      onClick={async()=>{
                        await api.delete(`/delete/${u._id}`);
                        loadMyUrls();
                      }}
                      style={{ ...smallIconBtn(darkMode), background:"#ef4444", color:"#fff" }}

                    >
                      <FaTrash/>
                    </button>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
