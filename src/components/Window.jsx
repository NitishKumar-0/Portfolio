import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function Window({ title, children, className = '', close, back }) {
  return <section className={`window ${className}`}>
    <div className="window-bar">
      <div className="window-dots"><i /><i /><i /></div>
      <div className="window-title">{title}</div>
      <div className="window-tools">
        {back && <button onClick={back} aria-label="Back"><ArrowLeft size={14} /></button>}
        {close && <button onClick={close} aria-label="Close"><X size={15} /></button>}
      </div>
    </div>
    <div className="window-body">{children}</div>
  </section>
}
