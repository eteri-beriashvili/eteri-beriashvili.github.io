/* v6: fallback to local photo archive when the source image cannot load. */
document.querySelectorAll('.eb-article img[data-local-fallback]').forEach(function(img){
  function backup(){
    if(img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied='1';
    img.src=img.getAttribute('data-local-fallback');
    img.alt='Этери Бериашвили — фотография из предоставленного архива';
    var fig=img.closest('figure');
    var caption=fig&&fig.querySelector('figcaption');
    if(caption) caption.textContent='Фотография из предоставленного архива (запасное изображение, дата не установлена).';
  }
  img.addEventListener('error',backup,{once:true});
  if(img.complete && !img.naturalWidth) backup();
});
