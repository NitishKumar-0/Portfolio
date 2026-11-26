import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import DesktopContent from './components/DesktopContent'
import { DetailContent, WelcomePanel } from './components/Details'
import { Window } from './components/Window'
import { Dock } from './components/Dock'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { HomeLaunchers } from './components/Launchers'
import { projects, skills } from './data/portfolio'

const sectionDetails = { Home: 'Home', About: 'About', Projects: 'Projects', Skills: 'Skills', Contact: 'Contact' }
const projectNames = projects.map(project => project.name)

export default function App() {
  const [view, setView] = useState('Home')
  const [bottomView, setBottomView] = useState('Home')
  const [detail, setDetail] = useState('Home')

  const navigate = name => {
    if (sectionDetails[name]) {
      setView(name)
      if (name === 'Home' || name === 'Projects' || name === 'Skills' || name === 'About') setDetail(name)
      if (name === 'Contact') {
        setDetail('Contact')
        setBottomView('Home')
        return
      }
      setBottomView(name)
      return
    }
    const destination = name === 'LeetCode' || name === 'GitHub activity' ? 'Activity' : projectNames.includes(name) ? 'Projects' : name.startsWith('skills:') || name.startsWith('skill:') ? 'Skills' : ['GitHub', 'LinkedIn', 'Resume'].includes(name) ? 'Home' : 'Contact'
    setView(destination)
    setBottomView(destination)
  }

  const select = name => {
    setDetail(name)
    if (name === 'About') setView('About')
    else if (name.startsWith('skills:') || name.startsWith('skill:') || name === 'Skills') setView('Skills')
    else if (name === 'LeetCode' || name === 'GitHub activity' || name === 'Activity') setView('Activity')
    else if (name === 'Contact' || name === 'Contact form') setView('Contact')
    else if (name === 'Projects' || projectNames.includes(name)) setView('Projects')
    else setView('Home')
  }

  const dockAction = name => sectionDetails[name] ? navigate(name) : select(name)

  useEffect(() => {
    const onKey = event => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return
      const shortcuts = { h: 'Home', a: 'About', p: 'Projects', s: 'Skills', c: 'Contact' }
      const destination = shortcuts[event.key.toLowerCase()]
      if (destination) { event.preventDefault(); navigate(destination) }
      if (event.key === 'Escape') navigate('Home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const title = detail.startsWith('skills:') ? detail.slice(7) : detail.startsWith('skill:') ? detail.slice(6) : detail === 'Home' ? 'Home' : detail
  const mobileBack = () => {
    if (view === 'Projects' && projectNames.includes(detail)) setDetail('Projects')
    else if (view === 'Skills' && detail.startsWith('skill:')) {
      const skillName = detail.slice(6)
      const category = Object.entries(skills).find(([, names]) => names.includes(skillName))?.[0]
      setDetail(category ? `skills:${category}` : 'Skills')
    } else if (view === 'Skills' && detail.startsWith('skills:')) setDetail('Skills')
    else setDetail(view)
  }

  return <div className="app light">
    <div className="desktop-shell">
      <Navbar view={view} navigate={navigate} />
      <section className="mobile-content-panel" aria-label={`${view} content`}>
        {((view === 'Projects' && projectNames.includes(detail)) || (view === 'Skills' && (detail.startsWith('skills:') || detail.startsWith('skill:'))) || (view === 'Home' && detail !== 'Home')) && <button className="mobile-back" onClick={mobileBack}><ArrowLeft size={17} /> Back</button>}
        {view === 'Home' ? detail !== 'Home' ? <DetailContent detail={detail} select={select} /> : <DetailContent detail="About" select={select} mobileHome /> : view === 'Projects' ? projectNames.includes(detail) ? <DetailContent detail={detail} select={select} /> : <DesktopContent view="Projects" detail={detail} select={select} /> : view === 'Skills' ? detail.startsWith('skills:') || detail.startsWith('skill:') ? <DetailContent detail={detail} select={select} /> : <DesktopContent view="Skills" detail={detail} select={select} /> : view === 'About' ? <DetailContent detail="About" select={select} /> : <DetailContent detail={detail} select={select} />}
      </section>
      <main className="workspace-layout">
        <section className="upper-workspace" aria-label="Main workspace">
          <Window title="Home" className="detail-window workspace-window hero-workspace-window">
            <div className="detail-content workspace-scroll-content">
              <Hero navigate={navigate} />
            </div>
          </Window>
        </section>
        <aside className="upper-right-pane" aria-label={detail === 'Home' ? 'Welcome' : 'Selected content'}>
          {detail === 'Home' ? <div className="welcome-side-panel"><WelcomePanel /></div> : <Window title={title} className="detail-window workspace-window" close={() => setDetail('Home')} back={() => setDetail('Home')}>
            <div key={detail} className="detail-content workspace-scroll-content"><DetailContent detail={detail} select={select} /></div>
          </Window>}
        </aside>
        <section className={`desktop-area bottom-desktop ${bottomView === 'Projects' ? 'projects-mode' : ''}`} aria-label="Quick access desktop">
          {bottomView === 'Home' ? <><div className="section-topline"><div><h2>Pick a window.</h2></div></div><HomeLaunchers select={select} detail={detail} /></> : <div className={`bottom-section-content ${bottomView === 'Projects' ? 'projects-section-content' : ''}`}><DesktopContent view={bottomView} detail={detail} select={select} /></div>}
        </section>
      </main>
      <footer><span>Designed and built by Nitish Kumar</span><span>{new Date().getFullYear()}</span></footer>
    </div>
    <Dock navigate={dockAction} />
  </div>
}
