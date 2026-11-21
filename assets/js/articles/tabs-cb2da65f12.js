/* Article tabs from user-provided HTML, externalized for v6. */
(function(){
  document.querySelectorAll('.eb-article [data-eb-tabs]').forEach(function(root){
    const tabs=Array.from(root.querySelectorAll('[role="tab"]'));
    const panels=Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function activate(idx,focus){
      tabs.forEach(function(tab,i){const active=i===idx;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
      panels.forEach(function(panel,i){panel.hidden=i!==idx;});
      if(focus)tabs[idx].focus();
    }
    tabs.forEach(function(tab,i){
      tab.addEventListener('click',function(){activate(i,false)});
      tab.addEventListener('keydown',function(event){
        let next=i;
        if(event.key==='ArrowRight')next=(i+1)%tabs.length;
        else if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=tabs.length-1;
        else return;
        event.preventDefault();activate(next,true);
      });
    });
  });
})();
