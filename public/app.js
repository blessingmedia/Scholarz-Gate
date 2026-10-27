(() => {
  const root=document.documentElement, body=document.body;
  const $=(q)=>document.querySelector(q), $$=(q)=>Array.from(document.querySelectorAll(q));
  const toast=(msg)=>{const node=$('#toast');if(!node)return;node.textContent=msg;node.classList.add('visible');setTimeout(()=>node.classList.remove('visible'),2500)};
  const themePref=localStorage.getItem('applymate:theme');
  const dark=()=>root.classList.toggle('dark',themePref==='dark'||(!themePref&&window.matchMedia('(prefers-color-scheme: dark)').matches)); dark();
  $('#themeToggle')?.addEventListener('click',()=>{const newMode=root.classList.contains('dark')?'light':'dark';localStorage.setItem('applymate:theme',newMode);root.classList.toggle('dark',newMode==='dark');toast(newMode==='dark'?'Dark mode':'Light mode')});
  const closeNav=()=>{body.classList.remove('nav-open');$('#navToggle')?.setAttribute('aria-expanded','false');};
  $('#navToggle')?.addEventListener('click',()=>{body.classList.toggle('nav-open');$('#navToggle').setAttribute('aria-expanded',String(body.classList.contains('nav-open')))});
  $('#navBackdrop')?.addEventListener('click',closeNav);
  $$('.nav-link').forEach(a=>{if(a.getAttribute('href')===location.pathname)a.classList.add('active');a.addEventListener('click',closeNav)});
  const read=()=>{try{return JSON.parse(localStorage.getItem('applymate:saved')||'[]')}catch{return []}};
  const write=items=>localStorage.setItem('applymate:saved',JSON.stringify(items));
  const sync=()=>{$$('.saveBtn').forEach(btn=>{const saved=read().some(x=>x.slug===btn.dataset.slug);btn.textContent=saved?'★ Saved':'☆ Save';btn.setAttribute('aria-pressed',String(saved))})};
  $$('.saveBtn').forEach(btn=>btn.addEventListener('click',()=>{const list=read();const idx=list.findIndex(x=>x.slug===btn.dataset.slug);if(idx>=0){list.splice(idx,1);toast('Removed from bookmarks')}else{list.push({slug:btn.dataset.slug,title:btn.dataset.title});toast('Saved to bookmarks')}write(list);sync()}));sync();
  const renderSaved=()=>{const node=$('#savedPosts');if(!node)return;const list=read();node.innerHTML=list.length?list.map(x=>`<div><a href="/applymate/${encodeURIComponent(x.slug)}">${x.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</a><button data-remove="${x.slug.replace(/"/g,'&quot;')}">Remove</button></div>`).join(''):'<p>You have no saved articles yet. Open a post and tap Save.</p>';node.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{write(read().filter(x=>x.slug!==b.dataset.remove));renderSaved()}))};renderSaved();
  $('#bookmarksToggle')?.addEventListener('click',()=>location.assign('/saved'));
  $('#shareArticle')?.addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);toast('Link copied')}}catch{toast('Could not share')}});
  const slides=$$('.slide');if(slides.length){let idx=0;let timer;const render=()=>{slides.forEach((el,i)=>el.classList.toggle('active',i===idx));$$('.slide-dots button').forEach((el,i)=>{el.classList.toggle('active',i===idx);el.setAttribute('aria-label',`Slide ${i+1}`)})};const go=(n)=>{idx=(n+slides.length)%slides.length;render()};$('#slidePrev')?.addEventListener('click',()=>go(idx-1));$('#slideNext')?.addEventListener('click',()=>go(idx+1));$$('.slide-dots button').forEach((el,i)=>el.addEventListener('click',()=>go(i)));render();if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){timer=setInterval(()=>go(idx+1),8000);$('#carousel')?.addEventListener('mouseenter',()=>clearInterval(timer))}}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNav();$('.searchbox')?.classList.remove('expanded')}const c=$('#carousel');if(c&&c.contains(document.activeElement)){if(e.key==='ArrowRight')$('#slideNext')?.click();if(e.key==='ArrowLeft')$('#slidePrev')?.click()}});
  $('#mobileSearch')?.addEventListener('click',()=>{const box=$('.searchbox');box?.classList.toggle('expanded');if(box?.classList.contains('expanded'))$('#siteSearch')?.focus()});
  const search=$('#siteSearch');if(search){const q=new URLSearchParams(location.search).get('q');if(q)search.value=q}
})();
