import React from 'react'
import { BookOpenCheck, Code2, FolderKanban, Github, Home, Mail, Sparkles } from 'lucide-react'

const items = [['Home', Home], ['Projects', FolderKanban], ['Skills', Sparkles], ['LeetCode', Code2], ['GitHub', Github], ['Resume', BookOpenCheck], ['Contact', Mail]]

export function Dock({ navigate }) {
  return <div className="dock" aria-label="Quick navigation">{items.map(([name, Icon]) => <button key={name} onClick={() => navigate(name)} aria-label={name}><Icon size={17} /><span>{name}</span></button>)}</div>
}
