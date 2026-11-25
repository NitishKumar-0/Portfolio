import React from 'react'
import { AboutExplorer, ContactExplorer, ProjectExplorer, SkillsExplorer } from './Launchers'

const headings = {
  Home: ['YOUR DESKTOP', 'Pick a window.'],
  About: ['', 'A little about me.'],
  Projects: ['', 'Choose a project.'],
  Skills: ['', 'Explore by category.'],
  Contact: ['CONTACT / CONNECT', 'Ways to connect.'],
}

export default function DesktopContent({ view, detail, select }) {
  const [eyebrow, title] = headings[view] || headings.Home
  return <section className="desktop-area" aria-label={`${view} desktop`}>
    <div className="section-topline"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div></div>
    {view === 'About' && <AboutExplorer select={select} />}
    {view === 'Projects' && <ProjectExplorer select={select} detail={detail} />}
    {view === 'Skills' && <SkillsExplorer select={select} detail={detail} />}
    {view === 'Contact' && <ContactExplorer select={select} />}
  </section>
}
