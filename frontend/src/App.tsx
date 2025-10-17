import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
const API = import.meta.env.VITE_API_URL || 'https://mansati-backend.onrender.com';
export default function App(){
  const [msg, setMsg] = useState('جارٍ التحميل...');
  const [services, setServices] = useState<any[]>([]);
  useEffect(()=>{
    axios.get(API + '/api').then(r=> setMsg(r.data.message)).catch(()=> setMsg('تعذر الاتصال بالخادم'));
    axios.get(API + '/api/services').then(r=> setServices(r.data.items)).catch(()=> {});
    const s = io(import.meta.env.VITE_SOCKET_URL || (API.replace('http','ws')));
    s.on('connect', ()=> console.log('socket connected'));
    s.on('chat', (d:any)=> console.log('chat', d));
    return ()=> s.disconnect();
  },[]);
  return (<div className="app" dir="rtl">
    <header className="header">
      <div className="brand">منصّتي</div>
    </header>
    <main className="container">
      <h2>مرحبا بك في منصّتي</h2>
      <p>{msg}</p>
      <section className="services">
        {services.map(s=> (<div key={s.id} className="service"><h3>{s.title}</h3><p>{s.description}</p><div className="price">${s.price}</div></div>))}
      </section>
    </main>
    <footer className="footer">© منصّتي</footer>
  </div>)
}
