/* Article tabs from user-provided HTML, externalized for v6. */
(function(){
  var root=document.querySelector('.eb-article [data-eb-tabs]');
  if(!root)return;
  var tabs=Array.from(root.querySelectorAll('[role="tab"]'));
  function activate(tab,focus){
    tabs.forEach(function(t){
      var isActive=t===tab;
      t.setAttribute('aria-selected',String(isActive));
      t.tabIndex=isActive?0:-1;
      var panel=document.getElementById(t.getAttribute('aria-controls'));
      if(panel)panel.hidden=!isActive;
    });
    if(focus)tab.focus();
  }
  tabs.forEach(function(tab,index){
    tab.addEventListener('click',function(){activate(tab,false)});
    tab.addEventListener('keydown',function(e){
      var next;
      if(e.key==='ArrowRight')next=(index+1)%tabs.length;
      else if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=tabs.length-1;
      else return;
      e.preventDefault();activate(tabs[next],true);
    });
  });
})();
