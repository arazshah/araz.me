(function(){
  var d=document.documentElement;
  var tb=document.getElementById('theme');
  if(tb)tb.addEventListener('click',function(){
    var dark=d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    var n=dark?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}
    window.dispatchEvent(new Event('themechange'));
  });
  var b=document.getElementById('burger'),m=document.getElementById('menu');
  if(b)b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08}):null;
  document.querySelectorAll('.card,.section h2,.stats,.timeline li').forEach(function(el){el.classList.add('reveal');io?io.observe(el):el.classList.add('in')});
})();
