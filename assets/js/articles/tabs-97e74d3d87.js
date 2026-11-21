/* Article tabs from user-provided HTML, externalized for v6. */
(function(){
 document.querySelectorAll('[data-eb-tabs]').forEach(function(root){
  var tabs=Array.from(root.querySelectorAll('[role="tab"]'));
  function activate(tab,focus){tabs.forEach(function(t){var yes=t===tab;t.setAttribute('aria-selected',String(yes));t.tabIndex=yes?0:-1;var p=document.getElementById(t.getAttribute('aria-controls'));if(p)p.hidden=!yes;});if(focus)tab.focus();}
  tabs.forEach(function(tab,i){tab.addEventListener('click',function(){activate(tab,false)});tab.addEventListener('keydown',function(e){var n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n],true);});});
 });
})();
