import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Disc3, Instagram, Menu, Pause, Play, Radio, X, Youtube } from "lucide-react";

const ASSET = {
  video: "/media/speedrizer-hero.mp4",
  logo: "/brand/speedrizer-nav-sr.png",
  heroLogo: "/brand/speedrizer-logo-transparent.png",
  cover: "/media/cover.jpg",
  cover2: "/media/cover2.png",
};

const tracks = [
  { title: "Chain Engine N Thunder", meta: "02:58", file: "/media/01-chain-engine-n-thunder.mp3", code: "SR-01" },
  { title: "Chrome Blood / Broken Chains", meta: "03:12", file: "/media/02-chrome-blood-broken-chains.mp3", code: "SR-02" },
  { title: "Feed The Machine", meta: "02:46", file: "/media/03-feed-the-machine.mp3", code: "SR-03" },
  { title: "Motor Speed N Roll", meta: "02:17", file: "/media/04-motor-speed-n-roll.mp3", code: "SR-04" },
  { title: "Raising The Speed", meta: "03:06", file: "/media/05-raising-the-speed.mp3", code: "SR-05" },
  { title: "Ride To Live", meta: "02:51", file: "/media/06-ride-to-live.mp3", code: "SR-06" },
  { title: "We Don't Sucks Anything", meta: "02:33", file: "/media/07-we-dont-sucks-anything.mp3", code: "SR-07" },
  { title: "Wrecking Machine / Another V", meta: "02:48", file: "/media/08-wrecking-machine-another-v.mp3", code: "SR-08" },
  { title: "Wrecking The Machine", meta: "02:52", file: "/media/09-wrecking-the-machine.mp3", code: "SR-09" },
];

const shows = [
  { date: "09.27", city: "JAKARTA", venue: "ROUTE 66 GARAGE", note: "WITH STATIC FLAME" },
  { date: "10.11", city: "BANDUNG", venue: "THE IRON ROOM", note: "BLACKTOP SESSION" },
  { date: "10.24", city: "SURABAYA", venue: "NOISE DISTRICT", note: "OPEN ROAD FEST" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tracklistRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [tracksVisible, setTracksVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeTrackData = useMemo(() => (activeTrack === null ? null : tracks[activeTrack]), [activeTrack]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setScrolled(window.scrollY > 36);
      const sections = ["hero", "manifesto", "music", "shows", "contact"];
      const current = sections.findLast((id) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < window.innerHeight * 0.48;
      });
      if (current) setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => undefined);
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, []);

  useEffect(() => {
    const element = tracklistRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTracksVisible(true);
    }, { threshold: 0.14 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrackData) return;
    audio.src = activeTrackData.file;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [activeTrackData]);

  const selectTrack = (index: number) => {
    if (activeTrack === index) {
      toggleAudio();
      return;
    }
    setActiveTrack(index);
    setCurrentTime(0);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio || activeTrack === null) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => undefined);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="site-shell">
      <audio
        ref={audioRef}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="noise-layer" aria-hidden="true" />
      <div className="progress-rail" aria-hidden="true">
        <span style={{ transform: `scaleY(${Math.max(progress, 0.035)})` }} />
      </div>

      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <button className="nav-mark" onClick={() => scrollToId("hero")} aria-label="Back to top">
          <img src={ASSET.logo} alt="Speedrizer SR" />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {[
            ["01", "manifesto", "Manifesto"],
            ["02", "music", "Music"],
            ["03", "shows", "Shows"],
          ].map(([number, id, label]) => (
            <button key={id} className={activeSection === id ? "active" : ""} onClick={() => scrollToId(id)}>
              <span>{number}</span>{label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <span className="nav-status"><i /> Live from the asphalt</span>
          <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        {[
          ["01", "manifesto", "Manifesto"],
          ["02", "music", "Music"],
          ["03", "shows", "Shows"],
          ["04", "contact", "Contact"],
        ].map(([number, id, label]) => (
          <button key={id} onClick={() => { scrollToId(id); setMenuOpen(false); }}><span>{number}</span>{label}</button>
        ))}
      </div>

      <main>
        <section id="hero" className="hero scene-section">
          <video ref={videoRef} className="hero-video" src={ASSET.video} autoPlay muted loop playsInline aria-label="Speedrizer motor-speed rock visual" />
          <div className="hero-vignette" />
          <div className="hero-scanlines" aria-hidden="true" />
          <div className="hero-topline"><span>EST. 2024 / IDN</span><span>BLACKTOP VOLTAGE</span></div>
          <div className="hero-copy">
            <div className="hero-kicker"><span className="slash" /> NO SLOW SONGS / NO SOFT EDGES</div>
            <div className="logo-lockup">
              <img src={ASSET.heroLogo} alt="Speedrizer" />
            </div>
            <p className="hero-subline">Motor-speed rock for the long way home.</p>
            <div className="hero-actions">
              <button className="red-button" onClick={() => scrollToId("music")}><Play size={15} fill="currentColor" /> Play the noise</button>
              <button className="text-button" onClick={() => scrollToId("shows")}>See the next show <ArrowDownRight size={17} /></button>
            </div>
          </div>
          <div className="hero-footer">
            <span>SCROLL TO IGNITE</span>
            <div className="scroll-cue"><span /><span /><span /></div>
            <span>00 / 05</span>
          </div>
          <div className="hero-chapter"><span>CHAPTER</span><strong>00</strong><em>/05</em></div>
        </section>

        <section id="manifesto" className="manifesto scene-section">
          <div className="manifesto-grid">
            <div className="section-label"><span>01</span><span>Manifesto</span><i /></div>
            <div className="manifesto-statement">
              <p className="eyebrow">BUILT FOR THE DISTANCE</p>
              <h2>TURN IT UP.<br /><em>KEEP MOVING.</em></h2>
              <p className="manifesto-body">We make songs for chrome under moonlight, for engines that refuse to cool down, for every exit taken too fast. No polish for the sake of polish. Just pressure, volume, and a road that keeps opening.</p>
              <button className="line-button" onClick={() => scrollToId("music")}>Enter the release <ArrowUpRight size={17} /></button>
            </div>
            <div className="manifesto-aside">
              <div className="aside-stamp">SR<br /><span>VOL. 01</span></div>
              <p>LOUD / PRECISE<br />UNAPOLOGETIC</p>
              <div className="vertical-rule" />
              <span className="aside-code">ID-SR / 2024—∞</span>
            </div>
          </div>
        </section>

        <section id="music" className="music scene-section">
          <div className="music-backdrop">
            <img src={ASSET.cover2} alt="Night road and machine details" />
            <div className="music-backdrop-overlay" />
          </div>
          <div className="music-inner">
            <div className="section-label light"><span>02</span><span>Music / Release</span><i /></div>
            <div className="music-intro">
              <div>
                <p className="eyebrow">FULL-LENGTH / 2024</p>
                <h2>NO BRAKES.<br /><em>ALL SIGNAL.</em></h2>
              </div>
              <div className="release-card">
                <img src={ASSET.cover} alt="Speedrizer release cover art" />
                <div className="release-card-copy"><span>RELEASE 001</span><strong>BLACKTOP<br />VOLTAGE</strong><small>09 tracks / 26:43</small></div>
              </div>
            </div>

            <div className="tracklist-head"><span>Track / title</span><span>Run time</span><span>Play state</span></div>
            <div ref={tracklistRef} className={`tracklist ${tracksVisible ? "is-visible" : ""}`} role="list" aria-label="Speedrizer tracks">
              {tracks.map((track, index) => {
                const selected = activeTrack === index;
                return (
                  <button className={`track-row ${selected ? "is-active" : ""}`} key={track.code} onClick={() => selectTrack(index)} role="listitem" aria-label={`${selected && isPlaying ? "Pause" : "Play"} ${track.title}`}>
                    <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="track-title"><strong>{track.title}</strong><small>{track.code} / SPEEDRIZER</small></span>
                    <span className="track-time">{selected && duration ? formatTime(currentTime) : track.meta}</span>
                    <span className="track-play">{selected && isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</span>
                    {selected && <span className="track-meter"><i /><i /><i /><i /><i /></span>}
                  </button>
                );
              })}
            </div>
            <div className="music-endline"><span>PLAYLIST CONTINUES IN THE DARK</span><span>TRACK {String((activeTrack ?? 0) + 1).padStart(2, "0")} / 09</span></div>
          </div>
        </section>

        <section id="shows" className="shows scene-section">
          <div className="shows-grid">
            <div className="section-label"><span>03</span><span>Tour / Shows</span><i /></div>
            <div className="shows-content">
              <div className="shows-heading"><p className="eyebrow">NO FIXED ADDRESS</p><h2>MEET US<br /><em>OUT THERE.</em></h2><p>Three nights. One loud machine. Bring earplugs if you want, but you won't use them.</p></div>
              <div className="show-list">
                {shows.map((show, index) => (
                  <button className="show-row" key={show.date} onClick={() => window.alert(`${show.city} — tickets drop soon.`)}>
                    <span className="show-index">0{index + 1}</span>
                    <span className="show-date">{show.date}<small>2024</small></span>
                    <span className="show-place"><strong>{show.city}</strong><small>{show.venue}</small></span>
                    <span className="show-note">{show.note}</span>
                    <ArrowUpRight className="show-arrow" size={20} />
                  </button>
                ))}
              </div>
              <button className="line-button dark" onClick={() => window.alert("More shows are being wired into the road map.")}>More dates incoming <ArrowUpRight size={17} /></button>
            </div>
          </div>
          <div className="shows-image"><img src={ASSET.cover2} alt="Motorcycle on a moonlit road" /><span>KEEP THE ENGINE HOT</span></div>
        </section>

        <section id="contact" className="contact scene-section">
          <div className="contact-inner">
            <div className="section-label light"><span>04</span><span>Contact / Socials</span><i /></div>
            <div className="contact-copy"><p className="eyebrow">FOR BOOKINGS / BAD IDEAS</p><h2>LET'S MAKE<br /><em>SOME NOISE.</em></h2><a className="contact-email" href="mailto:hello@speedrizer.band">hello@speedrizer.band <ArrowUpRight size={24} /></a></div>
            <div className="contact-bottom"><span>© SPEEDRIZER / ALL SIGNALS RESERVED</span><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={18} /></a><a href="mailto:hello@speedrizer.band" aria-label="Email"><Radio size={17} /></a></div><span>JKT — IDN / 2024</span></div>
          </div>
        </section>
      </main>

      <div className="now-playing" aria-live="polite">
        <div className={`now-playing-art ${activeTrack !== null ? "is-visible" : ""}`}><Disc3 size={16} /></div>
        <div className="now-playing-copy"><span>{activeTrack !== null ? "NOW PLAYING" : "SELECT A TRACK"}</span><strong>{activeTrackData?.title ?? "SPEEDRIZER / BLACKTOP VOLTAGE"}</strong></div>
        {activeTrack !== null && <button onClick={toggleAudio} aria-label={isPlaying ? "Pause track" : "Play track"}>{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button>}
        <div className="now-playing-progress"><span style={{ transform: `scaleX(${duration ? currentTime / duration : 0})` }} /></div>
      </div>
    </div>
  );
}
