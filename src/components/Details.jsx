import React, { useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, BookOpenCheck, Code2, ExternalLink, Github, Linkedin, Mail, Send } from 'lucide-react'
import { codingActivity, profile, projects, skills } from '../data/portfolio'
import { ActivityGraph, SkillLogo } from './Launchers'
import { LeetCodeHeatmap } from './LeetCodeHeatmap'

function Stat({ label, value }) {
  return <div className="stat-tile"><strong>{value ?? '-'}</strong><span>{label}</span></div>
}

export function WelcomePanel() {
  return <div className="welcome-panel detail-welcome">
    <p className="eyebrow">PERSONAL WORKSPACE <span className="live-dot" /></p>
    <div className="welcome-profile"><img src={profile.portrait} alt="Nitish Kumar" /><div><h2>Welcome to my workspace.</h2><p className="muted">{profile.intro}</p><p className="welcome-focus"><span className="live-dot" /> CURRENT FOCUS <strong>{profile.goal}</strong></p></div></div>
  </div>
}

function AboutPanel({ mobileHome = false }) {
  return <div className="detail-stack about-detail">
    <div className="about-intro">
      <img className="about-portrait-large" src={profile.portrait} alt="Nitish Kumar" />
      <div className="about-intro-copy"><h2>{mobileHome ? "Hi, I'm Nitish Kumar" : profile.name}</h2><p className="about-headline">{profile.headline}</p></div>
    </div>
    <p className="detail-copy">{profile.about}</p>
    <div className="detail-block"><span className="block-label">EDUCATION</span><p>{profile.education}</p></div>
    <div className="detail-block"><span className="block-label">INTERESTS</span><div className="badges">{profile.interests.map(item => <span key={item}>{item}</span>)}</div></div>
    <div className="detail-block"><span className="block-label">CURRENT GOAL</span><p>{profile.goal}</p></div>
    <div className="detail-actions"><a className="action-button" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ExternalLink size={13} /></a><a className="action-button" href={profile.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ExternalLink size={13} /></a><a className="action-button primary" href={profile.resume} download><ArrowDownToLine size={15} /> Resume</a></div>
  </div>
}

function ProjectDetails({ project }) {
  if (!project) return <div className="empty-detail"><Code2 /><p>Select a project on the left to see its details.</p></div>
  const hasLinks = Object.values(project.links).some(Boolean)
  return <div className="detail-stack project-detail">
    <div className="project-detail-top"><div className="project-symbol"><Code2 size={25} /></div>{project.links.demo && <a className="action-button primary project-demo-link" href={project.links.demo} target="_blank" rel="noreferrer">Live Demo <ExternalLink size={13} /></a>}</div><p className="eyebrow">PROJECT / SELECTED WORK</p><h2>{project.name}</h2><p className="project-type">{project.type}</p>
    <div className="detail-block"><span className="block-label">THE PROBLEM</span><p>{project.problem}</p></div>
    <div className="detail-block"><span className="block-label">THE APPROACH</span><p>{project.solution}</p></div>
    <div className="detail-block"><span className="block-label">FEATURES & FOCUS</span><ul className="feature-list">{project.features.map(item => <li key={item}>{item}</li>)}</ul></div>
    <div className="detail-block"><span className="block-label">TECH STACK</span><div className="badges">{project.tech.map(tech => <span key={tech}>{tech}</span>)}</div></div>
    {hasLinks && (project.links.github || project.links.video) && <div className="detail-actions">{project.links.github && <a className="action-button" href={project.links.github} target="_blank" rel="noreferrer"><Github size={15} /> Open GitHub</a>}{project.links.video && <a className="action-button" href={project.links.video} target="_blank" rel="noreferrer">Project video <ExternalLink size={13} /></a>}</div>}
    {!hasLinks && <p className="muted fine-print">Project links can be added in <code>src/data/portfolio.js</code>.</p>}
  </div>
}

function SkillDetails({ name }) {
  const category = Object.entries(skills).find(([, names]) => names.includes(name))?.[0]
  return <div className="skill-detail-panel"><h2>{name}</h2><p className="muted">This skill is part of my {category} skill set.</p><div className="detail-block"><span className="block-label">IN THIS CATEGORY</span><div className="badges">{(skills[category] || []).map(item => <span className={item === name ? 'current-skill' : ''} key={item}>{item}</span>)}</div></div><p className="fine-print muted">No proficiency scores are shown because none were provided.</p></div>
}

function SkillsPanel({ detail, select }) {
  const skillCategory = detail?.startsWith('skills:') ? detail.slice(7) : ''
  const skillName = detail?.startsWith('skill:') ? detail.slice(6) : ''
  if (skillName) return <SkillDetails name={skillName} />
  if (skillCategory && skills[skillCategory]) return <div className="skills-category-detail"><h2>{skillCategory}</h2><p className="muted">{skills[skillCategory].length} skills in this category. Select any tile to focus its details.</p><div className="skill-logo-grid">{skills[skillCategory].map(name => <button className="skill-logo-tile" key={name} onClick={() => select(`skill:${name}`)}><SkillLogo name={name} category={skillCategory} /><strong>{name}</strong><ArrowUpRight size={14} /></button>)}</div></div>
  return <div className="skills-panel"><h2>Tools I work with.</h2><p className="muted">Choose a category from the left to browse the individual skills and their visual cards.</p><div className="detail-block"><span className="block-label">CATEGORIES</span><div className="badges">{Object.keys(skills).map(category => <span key={category}>{category}</span>)}</div></div></div>
}

function ActivityPanel({ detail }) {
  if (detail === 'GitHub activity') return <div className="social-detail"><span className="brand-mark light"><Github size={27} /></span><p className="eyebrow">CODE / GITHUB</p><h2>GitHub activity</h2><p className="muted">Visit my GitHub profile to explore repositories and recent code.</p><div className="activity-chart-card"><div className="chart-header"><strong>Contribution calendar</strong><span>GitHub</span></div><ActivityGraph /></div><a className="action-button primary" href={profile.github} target="_blank" rel="noreferrer">Visit @{profile.githubUsername} <ExternalLink size={14} /></a></div>
  return <div className="activity-panel"><p className="eyebrow">CODING / ACTIVITY</p><h2>Practice, over time.</h2><p className="muted">Statistics only appear when verified data has been added.</p><div className="stat-grid"><Stat label="Problems solved" value={codingActivity.solved} /><Stat label="Active days" value={codingActivity.activeDays} /><Stat label="Current streak" value={codingActivity.currentStreak} /><Stat label="Longest streak" value={codingActivity.longestStreak} /></div><div className="activity-chart-card"><div className="chart-header"><strong>Contribution calendar</strong><span>LeetCode | GitHub</span></div><ActivityGraph /></div><div className="detail-actions">{profile.leetcode && <a className="action-button primary" href={profile.leetcode} target="_blank" rel="noreferrer">LeetCode profile <ExternalLink size={13} /></a>}<a className="action-button" href={profile.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub activity <ExternalLink size={13} /></a></div></div>
}

function LeetPanel() {
  return <div className="activity-panel leetcode-detail">
    <div className="social-profile"><span className="brand-mark orange"><Code2 size={20} /></span><div><strong>{profile.leetcodeUsername}</strong><span>LeetCode profile</span></div>{profile.leetcode && <a className="action-button primary" href={profile.leetcode} target="_blank" rel="noreferrer">Visit LeetCode <ExternalLink size={13} /></a>}</div>
    <LeetCodeHeatmap username={profile.leetcodeUsername} />
  </div>
}

function ContactPanel() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const update = event => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async event => {
    event.preventDefault()
    if (sending) return
    if (form.message.trim().length < 10) { setStatus('Please add a little more detail (at least 10 characters).'); return }
    setSending(true)
    setStatus('Sending message...')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Could not send your message. Please try again.')
      setStatus('Message sent. Thanks for reaching out!')
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus(error.message || 'The email service is unavailable. Please try again later.')
    } finally {
      setSending(false)
    }
  }
  return <div className="contact-panel"><h2>Let's build something.</h2><p className="muted">Have an idea, a question, or just want to connect?</p><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail size={15} />{profile.email}<ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} />LinkedIn<ArrowUpRight size={14} /></a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={15} />GitHub<ArrowUpRight size={14} /></a></div><form className="contact-form" onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={update} required maxLength="100" /></label><label>Email<input name="email" type="email" value={form.email} onChange={update} required maxLength="254" /></label><label>Message<textarea name="message" value={form.message} onChange={update} required minLength="10" maxLength="3000" rows="4" /></label><button className="action-button primary" type="submit" disabled={sending}><Send size={14} /> {sending ? 'Sending...' : 'Send message'}</button><p className="form-status" aria-live="polite">{status}</p></form></div>
}

export function DetailContent({ detail, select, mobileHome = false }) {
  if (!detail || detail === 'Welcome') return <WelcomePanel />
  if (detail === 'About') return <AboutPanel mobileHome={mobileHome} />
  if (detail === 'Skills' || detail.startsWith('skills:') || detail.startsWith('skill:')) return <SkillsPanel detail={detail} select={select} />
  if (detail === 'Activity' || detail === 'GitHub activity') return <ActivityPanel detail={detail} />
  if (detail === 'LeetCode') return <LeetPanel />
  if (detail === 'Contact' || detail === 'Contact form') return <ContactPanel />
  if (detail === 'GitHub') return <div className="social-detail"><span className="brand-mark light"><Github size={27} /></span><h2>GitHub</h2><p className="muted">@{profile.githubUsername} | Explore my repositories and current work.</p><a className="action-button primary" href={profile.github} target="_blank" rel="noreferrer">Visit GitHub <ExternalLink size={14} /></a></div>
  if (detail === 'LinkedIn') return <div className="social-detail"><span className="brand-mark blue"><Linkedin size={27} /></span><p className="eyebrow">PROFESSIONAL NETWORK</p><h2>LinkedIn</h2><p className="muted">Connect with me and follow my professional journey.</p><a className="action-button primary" href={profile.linkedin} target="_blank" rel="noreferrer">Open LinkedIn <ExternalLink size={14} /></a></div>
  if (detail === 'Resume') return <div className="social-detail"><span className="brand-mark orange"><BookOpenCheck size={25} /></span><h2>Nitish Kumar</h2><p className="muted">View or download my resume.</p><div className="detail-actions"><a className="action-button primary" href={profile.resume} target="_blank" rel="noreferrer">View resume <ExternalLink size={14} /></a><a className="action-button" href={profile.resume} download><ArrowDownToLine size={15} /> Download</a></div></div>
  const project = projects.find(item => item.name === detail)
  return project ? <ProjectDetails project={project} /> : <div className="empty-detail"><p>Select a window to see its details.</p></div>
}
