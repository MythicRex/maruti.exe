import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import { Instagram, Send, MessageCircle, ArrowUpRight, LockKeyhole, Mail, UserRound, Eye, EyeOff } from "lucide-react";
import "./styles.css";

const SOCIAL_URLS = {
  instagram: "https://www.instagram.com/mythic_rex",
  whatsapp: "https://wa.me/7321809790",
  telegram: "https://t.me/mythic_rex"
};

const PROJECTS = [
  { title: "Project One", description: "Test Your Luck & Strategy with the Ultimate Mines Game.", tech: ["JavaScript", "CSS", "Gambling"], image: "/project-1.jpeg", url: "https://mines-game-j78z7uh0z-mythicrexs-projects.vercel.app" },
  { title: "Project Two", description: "Sharpen Your Mind with the Ultimate Memory Challenge!", tech: ["Js", "Fun", "Memory"], image: "/project2.jpeg", url: "https://memory-games-tau-pied.vercel.app" },
  { title: "Project Three", description: "Reach New Heights in the Ultimate Tower Stacking Challenge!", tech: ["3d", "HTML", "Accuracy"], image: "/project3.jpeg", url: "https://tower-stack-three.vercel.app" },
  { title: "Project Four", description: "Fast, Precise and Effortless Calculation at Your Fingertips.", tech: ["JavaScript", "UI", "Productivity"], image: "/project4.jpeg", url: "https://calculator-five-cyan-17.vercel.app/" }
];

function GlassTilt({ children, className = "", intensity = 10, onClick }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    el.style.setProperty("--rx", `${-y * intensity}deg`);
    el.style.setProperty("--ry", `${x * intensity}deg`);
    el.style.setProperty("--mx", `${(x + .5) * 100}%`);
    el.style.setProperty("--my", `${(y + .5) * 100}%`);
  };
  const leave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--mx", "50%");
    ref.current.style.setProperty("--my", "50%");
  };
  return <div ref={ref} className={`tilt ${className}`} onMouseMove={move} onMouseLeave={leave} onClick={onClick}>{children}</div>;
}

function Letter3D({ type, color }) {
  const pieces = type === "M"
    ? [[0,0,0,.34,2.8,.55,0],[1.45,0,0,.34,2.8,.55,0],[.48,.65,0,.34,1.7,.55,-.58],[.97,.65,0,.34,1.7,.55,.58]]
    : [[0,0,0,.34,2.8,.55,0],[1.5,0,0,.34,2.8,.55,0],[.75,.92,0,1.45,.34,.55,0]];
  return <group>
    {pieces.map((p,i)=><mesh key={i} position={[p[0],p[1],p[2]]} rotation={[0,0,p[6]]}>
      <boxGeometry args={[p[3],p[4],p[5]]}/>
      <meshStandardMaterial color={color} metalness={.95} roughness={.1} emissive={color} emissiveIntensity={.7}/>
    </mesh>)}
  </group>;
}
function BoxLoader({ onDone }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // One complete 3-second cycle of the supplied 3D box loader.
    const close = setTimeout(() => setClosing(true), 3000);
    const done = setTimeout(onDone, 3450);
    return () => { clearTimeout(close); clearTimeout(done); };
  }, [onDone]);

  return (
    <div className={`box-loader-screen ${closing ? "box-loader-closing" : ""}`}>
      <div className="loader">
        {Array.from({length: 8}, (_, i) => (
          <div className={`box box${i}`} key={i}><div /></div>
        ))}
        <div className="ground"><div /></div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav-wrap">
      <nav className="nav glass">
        <Link to="/" className="brand">
          <span className="logo-box"><img src="/logo.jpeg" alt="Logo" onError={(e) => { e.currentTarget.style.display = "none"; }} /><span>MN</span></span>
          <span>Maruti.Exe</span>
        </Link>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}

function AmbientScene() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += .0008;
    ref.current.rotation.y += .0012;
    ref.current.position.x = state.pointer.x * .18;
    ref.current.position.y = state.pointer.y * .12;
  });

  const nodes = [
    [-4.2,2.0,-2.0,.55], [3.8,2.0,-1.5,.9], [4.6,-2.0,-2.5,.45],
    [-3.8,-2.4,-1.8,.75], [1.0,2.7,-3,.3], [-1.5,-2.7,-3,.4]
  ];

  return <group ref={ref}>
    {nodes.map((n,i) => <mesh key={i} position={n.slice(0,3)}>
      <icosahedronGeometry args={[n[3],1]}/>
      <meshStandardMaterial color={i%2 ? "#7658ff" : "#35d8ff"} wireframe transparent opacity={.28}/>
    </mesh>)}
    <mesh position={[0,0,-3]}>
      <torusKnotGeometry args={[1.25,.025,120,12]}/>
      <meshStandardMaterial color="#8d72ff" emissive="#684cff" emissiveIntensity={1.5} wireframe/>
    </mesh>
    <mesh position={[-2.7,.3,-2]}>
      <torusGeometry args={[1.25,.025,16,80]}/>
      <meshStandardMaterial color="#35d8ff" emissive="#35d8ff" emissiveIntensity={2}/>
    </mesh>
    <mesh position={[2.8,-.8,-2]}>
      <octahedronGeometry args={[.8,1]}/>
      <meshStandardMaterial color="#a786ff" wireframe transparent opacity={.35}/>
    </mesh>
  </group>;
}

function Hero() {
  return (
    <section id="home" className="hero section">
      <div className="hero-bg">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={1} />
          <pointLight position={[4, 3, 5]} intensity={10} color="#6c4dff" />
          <pointLight position={[-4, -3, 3]} intensity={8} color="#22d3ee" />
          <AmbientScene />
        </Canvas>
      </div>
      <GlassTilt className="hero-card glass" intensity={7}>
        <div className="eyebrow">CREATIVE DEVELOPER / EDITOR</div>
        <h1>Maruti<br /><span>Nandan.</span></h1>
        <p>I'm someone who believes in staying curious,thinking diffrently and always becoming better than i was yesterday!</p>
        <div className="hero-actions">
          <a className="primary-btn" href="#projects">Explore Projects <ArrowUpRight size={18} /></a>
          <a className="ghost-btn" href="#about">About me</a>
        </div>
      </GlassTilt>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section content-section">
      <div className="section-heading">
        <span>02 / WORK</span>
        <h2>MY WORKS</h2>
        <p>Have a look at some of my recent work.</p>
      </div>
      <div className="project-grid">
        {PROJECTS.map((p, i) => (
          <GlassTilt key={p.title} className="project-card glass" intensity={9} onClick={() => window.open(p.url, "_blank", "noopener,noreferrer")}>
            <div className="project-image">
              <img 
                src={p.image}
                alt={p.title}
                className="project-preview"
              />
              <div className="image-overlay">
                <span>VIEW PROJECT </span>
              </div>
              <ArrowUpRight className="project-arrow" />
            </div>
            <div className="project-copy">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">{p.tech.map(t => <span key={t}>{t}</span>)}</div>
            </div>
          </GlassTilt>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section content-section about-section">
      <div className="about-card glass">
        <div><span className="eyebrow">03 / ABOUT</span><h2>Designing with curiosity.</h2></div>
        <p>I'm Maruti Nandan,a curious learner who loves turning ideas into something real. I explore technology, coding, and creative projects to keep growing every day.I enjoy solving problems, experimenting with new things, and pushing my limits.For me, every project is another step toward becoming better than yesterday.</p>
      </div>
    </section>
  );
}

function Footer() {
  const socials = [
    ["Instagram", Instagram, SOCIAL_URLS.instagram],
    ["WhatsApp", MessageCircle, SOCIAL_URLS.whatsapp],
    ["Telegram", Send, SOCIAL_URLS.telegram]
  ];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div><strong>Maruti.Exe</strong><span>© 2026 Maruti Nandan</span></div>
        <div className="social-grid">
          {socials.map(([name, Icon, url]) => (
            <a className="social-card glass" href={url} target="_blank" rel="noreferrer" key={name}>
              <Icon size={22} /><span>{name}</span><ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const [intro, setIntro] = useState(true);
  return <div className="site">{intro && <BoxLoader onDone={() => setIntro(false)} />}<Nav /><main><Hero /><Projects /><About /></main><Footer /></div>;
}

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.password) {
      setStatus("Please enter a name, valid email and password.");
      return;
    }
    // Demo-only login. Do NOT send passwords or login credentials to Telegram.
    // For real authentication, connect this form to a proper auth backend/provider.
    sessionStorage.setItem("marutiLoggedIn", "true");
    setStatus("Access granted. Welcome.");
    setTimeout(() => navigate("/"), 700);
  };

  return (
    <div className="login-page">
      <Link className="back-link" to="/">← Back to portfolio</Link>
      <div className="login-glow" />
      <GlassTilt className="login-card glass" intensity={6}>
        <div className="robot-head">
          <div className="antenna" />
          <div className="robot-eyes"><span /><span /></div>
          <div className="robot-mouth" />
        </div>
        <div className="eyebrow">SECURE ACCESS</div>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to continue to the Maruti.Exe experience.</p>
        <form onSubmit={submit}>
          <label><UserRound size={18} /><input placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></label>
          <label><Mail size={18} /><input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
          <label><LockKeyhole size={18} /><input type={show ? "text" : "password"} placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></label>
          <button className="login-btn" type="submit">LOG ME IN <ArrowUpRight size={18}/></button>
        </form>
        {status && <div className="login-status">{status}</div>}
        <div className="demo-note"><span className="status-dot" /> Demo authentication · your password stays on this device</div>
      </GlassTilt>
    </div>
  );
}

function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App /></BrowserRouter>);
