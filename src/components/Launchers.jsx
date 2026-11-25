import React, { useState } from 'react'
import { Activity, ArrowRight, ArrowUpRight, BookOpenCheck, Code2, Database, FolderKanban, Github, Linkedin, Mail, Send, Sparkles, Terminal, UserRound } from 'lucide-react'
import { codingActivity, profile, projects, skills } from '../data/portfolio'

const categoryIcons = { Languages: Code2, 'Web & backend': FolderKanban, Databases: Database, 'Computer science': Activity, AI: Sparkles, 'Tools & infrastructure': Terminal }

export function HomeLaunchers({ select, detail }) {
  return <div className="launcher-row">
    <button aria-pressed={detail === 'About'} className={`launch-card face-card ${detail === 'About' ? 'selected' : ''}`} onClick={() => select('About')}><div className="face-image-wrap"><img src={profile.portrait} alt="Nitish Kumar" /><span className="face-open"><ArrowUpRight size={14} /></span></div><div className="face-caption"><span><UserRound size={12} /> ABOUT ME</span><strong>Nitish Kumar</strong></div></button>
    <button aria-pressed={detail === 'LeetCode'} className={`launch-card leet-card ${detail === 'LeetCode' ? 'selected' : ''}`} onClick={() => select('LeetCode')}><div className="card-title"><span className="brand-mark orange"><Code2 size={17} /></span><strong>LeetCode</strong><ArrowUpRight size={15} /></div><div className="leet-preview"><span>365-day activity</span></div><div className="card-foot"><span>Activity | last 365 days</span><span className="round-arrow"><ArrowRight size={14} /></span></div></button>
    <SocialCard title="LinkedIn" subtitle="Connect with me" icon={Linkedin} tone="blue" selected={detail === 'LinkedIn'} open={() => select('LinkedIn')} />
    <SocialCard title="GitHub" subtitle="Explore my code" icon={Github} tone="light" selected={detail === 'GitHub' || detail === 'GitHub activity'} open={() => select('GitHub')} />
    <SocialCard title="Resume" subtitle="View / Download" icon={BookOpenCheck} tone="orange" selected={detail === 'Resume'} open={() => select('Resume')} />
  </div>
}

function SocialCard({ title, subtitle, icon: Icon, tone, selected, open }) {
  return <button aria-pressed={selected} className={`launch-card social-card ${selected ? 'selected' : ''}`} onClick={open}>
    <div className="mini-dots"><i /><i /><i /></div>
    <div className="social-heading"><span className={`brand-mark ${tone}`}><Icon size={18} /></span><strong>{title}</strong><ArrowUpRight size={14} /></div>
    <div className="card-foot"><span>{subtitle}</span><span className="round-arrow"><ArrowRight size={14} /></span></div>
  </button>
}

export function ActivityGraph({ compact = false }) {
  const days = Array.from({ length: compact ? 70 : 364 }, (_, i) => i)
  const today = new Date()
  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1)
    return date.toLocaleString('en', { month: 'short' })
  })
  return <div className={`activity-graph ${compact ? 'compact' : ''}`}>
    {!compact && <div className="month-row">{monthLabels.map((month, i) => <span key={`${month}-${i}`}>{month}</span>)}</div>}
    <div className="graph-grid">{days.map(i => {
      const level = codingActivity.contributions[i]
      const date = new Date(today)
      date.setDate(today.getDate() - (days.length - 1 - i))
      const label = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
      return <span key={i} className={level ? `level-${level}` : 'empty'} title={`${label} | ${level ? `activity level ${level}` : 'no verified activity data'}`} />
    })}</div>
    {!compact && <div className="graph-caption"><span>{codingActivity.contributions.length ? 'Activity data configured' : 'Contribution data not configured yet'}</span><span className="graph-legend">Less <i /><i /><i /><i /> More</span></div>}
  </div>
}

export function SkillLogo({ name, category }) {
  const logos = { Java: 'java', 'C++': 'cplusplus', JavaScript: 'javascript', 'React.js': 'react', 'Node.js': 'nodejs', 'Express.js': 'express', MongoDB: 'mongodb', MySQL: 'mysql', Docker: 'docker', Git: 'git', GitHub: 'github', Linux: 'linux', 'Linux/Unix': 'linux', Kubernetes: 'kubernetes', 'Kubernetes (Basics)': 'kubernetes', 'Machine Learning': 'tensorflow', 'AI/LLM Integration': 'openai' }
  const slug = logos[name]
  const [failed, setFailed] = useState(false)
  const Icon = categoryIcons[category] || Code2
  return <span className="skill-logo-wrap">{slug && !failed ? <img className="skill-logo" src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`} alt="" onError={() => setFailed(true)} /> : <Icon className="skill-fallback-icon" size={25} />}</span>
}

export function ProjectExplorer({ select, detail }) {
  return <div className="selection-grid">{projects.map((project, index) => <button className={`selection-card ${detail === project.name ? 'selected' : ''}`} key={project.name} onClick={() => select(project.name)}><span className={`project-glyph color-${index}`}><Code2 size={20} /></span><span className="selection-info"><strong>{project.name}</strong><small>{project.type}</small><span className="badges">{project.tech.slice(0, 3).map(tech => <i key={tech}>{tech}</i>)}</span></span><ArrowUpRight size={17} /></button>)}</div>
}

export function SkillsExplorer({ select, detail }) {
  const categories = Object.keys(skills)
  const active = detail?.startsWith('skills:') ? detail.slice(7) : ''
  const descriptions = { Languages: 'Programming languages I use', 'Web & backend': 'Frontend and backend development', Databases: 'Data storage and querying', 'Computer science': 'Core concepts and foundations', AI: 'Machine learning and AI tools', 'Tools & infrastructure': 'Developer tools and platforms' }
  return <div className="selection-grid skill-category-list" role="tablist" aria-label="Skill categories">{categories.map((name, index) => {
    const Icon = categoryIcons[name] || Code2
    return <button role="tab" aria-selected={active === name} className={`selection-card skill-selection-card ${active === name ? 'selected' : ''}`} key={name} onClick={() => select(`skills:${name}`)}><span className={`project-glyph skill-glyph tone-${index % 3}`}><Icon size={19} /></span><span className="selection-info"><strong>{name}</strong><small>{descriptions[name]}</small><span className="badges">{skills[name].slice(0, 3).map(skill => <i key={skill}>{skill}</i>)}</span></span><ArrowUpRight size={16} /></button>
  })}</div>
}

export function ActivityExplorer({ select }) {
  return <div className="activity-shortcuts"><button onClick={() => select('LeetCode')}><Code2 /><strong>LeetCode</strong><span>Problem solving and contribution calendar</span><ArrowUpRight size={15} /></button><button onClick={() => select('GitHub activity')}><Github /><strong>GitHub activity</strong><span>Code and repository activity</span><ArrowUpRight size={15} /></button><div className="activity-preview"><div className="chart-header"><strong>Activity calendar</strong><span>Verified data only</span></div><ActivityGraph compact={false} /></div></div>
}

export function ContactExplorer({ select }) {
  return <div className="contact-shortcuts"><button onClick={() => select('Contact form')}><Mail /><strong>Send a message</strong><span>Open the contact form</span><ArrowUpRight size={15} /></button><a href={`mailto:${profile.email}`}><Send /><strong>Email directly</strong><span>{profile.email}</span><ArrowUpRight size={15} /></a><button onClick={() => select('LinkedIn')}><Linkedin /><strong>LinkedIn</strong><span>Professional profile</span><ArrowUpRight size={15} /></button></div>
}

export function AboutExplorer({ select }) {
  return <button className="about-shortcut" onClick={() => select('About')}><img src={profile.portrait} alt="" /><span><strong>My story</strong><small>Education, interests, and what I'm working toward</small></span><ArrowUpRight size={16} /></button>
}
