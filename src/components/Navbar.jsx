import React from 'react'
import { ArrowDownToLine } from 'lucide-react'
import { profile } from '../data/portfolio'

const tabs = ['Home', 'About', 'Projects', 'Skills', 'Contact']

export default function Navbar({ view, navigate }) {
  return <header className="navbar">
    <button className="brand" onClick={() => navigate('Home')}><span>Nitish Kumar</span></button>
    <nav aria-label="Main navigation">{tabs.map(tab => <button key={tab} className={view === tab ? 'active' : ''} onClick={() => navigate(tab)}>{tab}</button>)}</nav>
    <a className="nav-resume" href={profile.resume} download aria-label="Download resume"><span>Download Resume</span><ArrowDownToLine size={14} /></a>
  </header>
}
