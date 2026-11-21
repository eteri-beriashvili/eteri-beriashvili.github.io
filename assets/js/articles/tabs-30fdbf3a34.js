/* Article tabs from user-provided HTML, externalized for v6. */
(function(){
  document.querySelectorAll('[data-eb-tabs]').forEach(function(root){
    var tabs=Array.from(root.querySelectorAll('[role="tab"]'));
    function activate(tab,focus){
      tabs.forEach(function(item){
        var selected=item===tab;
        item.setAttribute('aria-selected',String(selected));
        item.tabIndex=selected?0:-1;
        var panel=document.getElementById(item.getAttribute('aria-controls'));
        if(panel) panel.hidden=!selected;
      });
      if(focus) tab.focus();
    }
    tabs.forEach(function(tab,index){
      tab.addEventListener('click',function(){activate(tab,false)});
      tab.addEventListener('keydown',function(event){
        var target=index;
        if(event.key==='ArrowRight') target=(index+1)%tabs.length;
        else if(event.key==='ArrowLeft') target=(index-1+tabs.length)%tabs.length;
        else if(event.key==='Home') target=0;
        else if(event.key==='End') target=tabs.length-1;
        else return;
        event.preventDefault();activate(tabs[target],true);
      });
    });
  });
})();
