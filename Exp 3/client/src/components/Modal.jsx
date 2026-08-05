import React from 'react'

export default function Modal({title, children, onClose}){
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.4)'}}>
      <div style={{background:'var(--card)',padding:20,borderRadius:12,minWidth:300}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h4>{title}</h4>
          <button onClick={onClose}>X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
