/* v5: копирование фрагментов — работает и через file://, без библиотек. */
(()=>{'use strict';document.querySelectorAll('[data-copy-block]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const unit=button.closest('.demo-unit');const code=unit&&unit.querySelector('.demo-source pre code');if(!code)return;
    const value=code.textContent;let ok=false;
    if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(value);ok=true;}catch(e){}}
    if(!ok){const ta=document.createElement('textarea');ta.value=value;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{ok=document.execCommand('copy');}catch(e){}ta.remove();}
    button.textContent=ok?'Скопировано ✓':'Выделите код ниже и скопируйте';
    window.setTimeout(()=>{button.textContent='Скопировать HTML';},2500);
  });
});})();
