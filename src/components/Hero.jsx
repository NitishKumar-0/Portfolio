import React from 'react'
import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import { profile } from '../data/portfolio'

export default function Hero({ navigate }) {
  return <section className="hero" id="home">
    <div className="hero-image" /><div className="hero-shade" />
    <div className="hero-copy"><p className="eyebrow"><span className="status-pip" /> DEVELOPER · PROBLEM SOLVER</p><h1>Hi, I’m<br /><span>Nitish Kumar</span></h1><p className="hero-role">{profile.headline}</p><p className="hero-intro">{profile.intro}</p><div className="hero-actions"><button className="hero-primary" onClick={() => navigate('Projects')}>View Projects <ArrowRight size={16} /></button><a className="hero-secondary" href={profile.resume} download>Download Resume <ArrowDownToLine size={15} /></a></div></div>
    <div className="hero-meta"><span><span className="live-dot" /> Available for good ideas</span><span>Chitkara University · CSE</span></div>
  </section>
}
