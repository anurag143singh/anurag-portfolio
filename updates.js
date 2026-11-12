async function loadPortfolioUpdates(){
  const grid=document.querySelector('#update-grid');if(!grid)return;
  try{
    const response=await fetch('portfolio-data.json',{cache:'no-store'});if(!response.ok)throw new Error('Could not load the portfolio data file.');
    const data=await response.json();const entries=Array.isArray(data.entries)?data.entries:[];
    grid.replaceChildren();
    if(!entries.length){grid.innerHTML='<p class="update-empty">No updates yet. New milestones will appear here.</p>';return;}
    entries.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).forEach((entry,index)=>{
      const card=document.createElement('article');card.className='update-card';card.style.setProperty('--card-delay',`${Math.min(index,5)*70}ms`);
      if(entry.image&&/^(assets\/[\w./-]+)$/.test(entry.image)){const img=document.createElement('img');img.src=entry.image;img.alt=entry.imageAlt||`${entry.title||'Portfolio update'} image`;img.width=480;img.height=320;img.loading='lazy';img.decoding='async';card.append(img);}
      const body=document.createElement('div');body.className='update-body';const meta=document.createElement('p');meta.className='update-meta';meta.textContent=[entry.type||'Update',entry.date].filter(Boolean).join(' · ');const h=document.createElement('h3');h.textContent=entry.title||'New update';const p=document.createElement('p');p.textContent=entry.summary||'';body.append(meta,h,p);
      if(entry.details){const d=document.createElement('details');d.className='update-details';const s=document.createElement('summary');s.textContent='View details';const more=document.createElement('p');more.textContent=entry.details;d.append(s,more);body.append(d);}
      if(entry.link&&/^https:\/\//i.test(entry.link)){const a=document.createElement('a');a.href=entry.link;a.target='_blank';a.rel='noopener noreferrer';a.className='update-link';a.textContent='Open related link ↗';body.append(a);}
      card.append(body);grid.append(card);
    });
  }catch(error){grid.innerHTML='<p class="update-empty">To preview updates locally, open this folder with a local web server. The live GitHub Pages version loads them automatically.</p>';}
}
loadPortfolioUpdates();

