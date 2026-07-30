/* ============================================
   SAT KARTAR TOUR & TRAVELS
   Premium JavaScript
   ============================================ */
(function(){
'use strict';

/* ========== Page Loader ========== */
window.addEventListener('load',function(){
  var loader=document.getElementById('page-loader');
  if(loader){
    setTimeout(function(){loader.classList.add('hidden')},1800);
    setTimeout(function(){loader.style.display='none'},2400);
  }
});

/* ========== Theme Toggle ========== */
var themeToggle=document.getElementById('theme-toggle');
if(themeToggle){
  var saved=localStorage.getItem('theme');
  if(saved){document.documentElement.setAttribute('data-theme',saved)}
  themeToggle.addEventListener('click',function(){
    var current=document.documentElement.getAttribute('data-theme');
    var next=current==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    localStorage.setItem('theme',next);
  });
}

/* ========== Scroll Progress ========== */
var scrollProg=document.getElementById('scroll-progress');
if(scrollProg){
  window.addEventListener('scroll',function(){
    var h=document.documentElement;
    var pct=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
    scrollProg.style.width=pct+'%';
  },{passive:true});
}

/* ========== Navbar Scroll ========== */
var navbar=document.getElementById('navbar');
var navLinks=document.querySelectorAll('.nav-link');
var sections=document.querySelectorAll('section[id]');
if(navbar){
  window.addEventListener('scroll',function(){
    if(window.scrollY>50){navbar.classList.add('scrolled')}
    else{navbar.classList.remove('scrolled')}
  },{passive:true});
}

/* ========== Active Nav Link ========== */
function updateActiveLink(){
  var scrollY=window.scrollY+120;
  sections.forEach(function(sec){
    var top=sec.offsetTop;
    var height=sec.offsetHeight;
    var id=sec.getAttribute('id');
    if(scrollY>=top&&scrollY<top+height){
      navLinks.forEach(function(l){l.classList.remove('active')});
      var active=document.querySelector('.nav-link[href="#'+id+'"]');
      if(active)active.classList.add('active');
    }
  });
}
window.addEventListener('scroll',updateActiveLink,{passive:true});

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var href=this.getAttribute('href');
    if(href==='#')return;
    e.preventDefault();
    var target=document.querySelector(href);
    if(target){
      var offset=navbar?navbar.offsetHeight:0;
      var pos=target.getBoundingClientRect().top+window.scrollY-offset;
      window.scrollTo({top:pos,behavior:'smooth'});
      // Close mobile menu
      var mobileToggle=document.getElementById('mobile-toggle');
      var navMenu=document.getElementById('nav-menu');
      if(mobileToggle&&navMenu){
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
      }
    }
  });
});

/* ========== Mobile Menu ========== */
var mobileToggle=document.getElementById('mobile-toggle');
var navMenu=document.getElementById('nav-menu');
if(mobileToggle&&navMenu){
  mobileToggle.addEventListener('click',function(){
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    var expanded=this.getAttribute('aria-expanded')==='true';
    this.setAttribute('aria-expanded',!expanded);
    document.body.style.overflow=navMenu.classList.contains('active')?'hidden':'';
  });
}

/* ========== Scroll Reveal ========== */
var reveals=document.querySelectorAll('[data-reveal]');
function checkReveal(){
  reveals.forEach(function(el){
    var rect=el.getBoundingClientRect();
    var h=window.innerHeight;
    if(rect.top<h-80){el.classList.add('revealed')}
  });
}
window.addEventListener('scroll',checkReveal,{passive:true});
window.addEventListener('load',function(){setTimeout(checkReveal,200)});

/* ========== Animated Counters ========== */
var counters=document.querySelectorAll('[data-count]');
var counterDone=false;
function animateCounters(){
  if(counterDone)return;
  var first= counters[0];
  if(!first)return;
  var rect=first.getBoundingClientRect();
  if(rect.top<window.innerHeight&&rect.bottom>0){
    counterDone=true;
    counters.forEach(function(c){
      var target=parseInt(c.getAttribute('data-count'),10);
      var duration=2000;
      var start=0;
      var startTime=null;
      function step(ts){
        if(!startTime)startTime=ts;
        var progress=Math.min((ts-startTime)/duration,1);
        var ease=1-Math.pow(1-progress,3);
        c.textContent=Math.floor(ease*target);
        if(progress<1)requestAnimationFrame(step);
        else c.textContent=target;
      }
      requestAnimationFrame(step);
    });
  }
}
window.addEventListener('scroll',animateCounters,{passive:true});

/* ========== Testimonials Slider ========== */
(function(){
  var track=document.querySelector('.testimonials-track');
  var cards=document.querySelectorAll('.testimonial-card');
  var prev=document.querySelector('.slider-prev');
  var next=document.querySelector('.slider-next');
  var dotsContainer=document.getElementById('slider-dots');
  if(!track||!cards.length)return;
  var current=0;
  var perPage=getPerPage();
  var total=Math.ceil(cards.length/perPage);

  function getPerPage(){
    var w=window.innerWidth;
    if(w<=768)return 1;
    if(w<=1024)return 2;
    return 3;
  }

  function buildDots(){
    if(!dotsContainer)return;
    dotsContainer.innerHTML='';
    for(var i=0;i<total;i++){
      var dot=document.createElement('div');
      dot.className='slider-dot'+(i===0?' active':'');
      dot.setAttribute('data-index',i);
      dot.addEventListener('click',function(){goTo(parseInt(this.getAttribute('data-index'),10))});
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(idx){
    current=idx;
    if(current<0)current=total-1;
    if(current>=total)current=0;
    var w=track.parentElement.offsetWidth;
    track.style.transform='translateX(-'+(current*w)+'px)';
    var dots=dotsContainer?dotsContainer.querySelectorAll('.slider-dot'):[];
    dots.forEach(function(d,i){d.classList.toggle('active',i===current)});
  }

  if(prev)prev.addEventListener('click',function(){goTo(current-1)});
  if(next)next.addEventListener('click',function(){goTo(current+1)});

  buildDots();
  goTo(0);

  var autoSlide=setInterval(function(){goTo(current+1)},5000);
  track.parentElement.addEventListener('mouseenter',function(){clearInterval(autoSlide)});
  track.parentElement.addEventListener('mouseleave',function(){
    autoSlide=setInterval(function(){goTo(current+1)},5000);
  });

  window.addEventListener('resize',function(){
    perPage=getPerPage();
    total=Math.ceil(cards.length/perPage);
    buildDots();
    goTo(0);
  });
})();

/* ========== FAQ Accordion ========== */
document.querySelectorAll('.faq-question').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=this.parentElement;
    var wasActive=item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(function(fi){
      fi.classList.remove('active');
      fi.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if(!wasActive){
      item.classList.add('active');
      this.setAttribute('aria-expanded','true');
    }
  });
});

/* ========== Destination Filter ========== */
document.querySelectorAll('.filter-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active')});
    this.classList.add('active');
    var filter=this.getAttribute('data-filter');
    var cards=document.querySelectorAll('.destination-card');
    var visibleCount=0;
    cards.forEach(function(card){
      var match=filter==='all'||card.getAttribute('data-category')===filter;
      if(match){
        card.classList.remove('hidden');
        card.style.transitionDelay=(visibleCount*0.05)+'s';
        visibleCount++;
      }else{
        card.style.transitionDelay='0s';
        card.classList.add('hidden');
      }
    });
  });
});

/* ========== Destination Modal ========== */
var modal=document.getElementById('destination-modal');
var destImages={
  dubai:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=450&fit=crop',
  canada:'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=450&fit=crop',
  australia:'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=450&fit=crop',
  uk:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=450&fit=crop',
  singapore:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=450&fit=crop',
  thailand:'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=450&fit=crop',
  malaysia:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=450&fit=crop',
  europe:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=450&fit=crop',
  usa:'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=800&h=450&fit=crop',
  newzealand:'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&h=450&fit=crop'
};
var destData={
  dubai:{name:'Dubai, UAE',desc:'Experience the perfect blend of modern luxury and traditional Arabian culture. From the towering Burj Khalifa to the enchanting desert safaris, Dubai offers an unforgettable experience.',details:[{label:'Duration',value:'5-7 Days'},{label:'Best Time',value:'Nov - Mar'},{label:'Language',value:'Arabic, English'},{label:'Currency',value:'AED'},{label:'Flight Time',value:'~3.5 Hours'},{label:'Offer',value:'5% OFF'}]},
  canada:{name:'Canada',desc:'Discover the breathtaking beauty of Canada, from the majestic Rocky Mountains to vibrant multicultural cities like Toronto, Vancouver, and Montreal.',details:[{label:'Duration',value:'10-14 Days'},{label:'Best Time',value:'Jun - Sep'},{label:'Language',value:'English, French'},{label:'Currency',value:'CAD'},{label:'Flight Time',value:'~14 Hours'},{label:'Offer',value:'3% OFF'}]},
  australia:{name:'Australia',desc:'Explore the land down under with pristine beaches, unique wildlife, the iconic Opera House, and the vast Outback adventure.',details:[{label:'Duration',value:'10-14 Days'},{label:'Best Time',value:'Oct - Apr'},{label:'Language',value:'English'},{label:'Currency',value:'AUD'},{label:'Flight Time',value:'~12 Hours'},{label:'Offer',value:'7% OFF'}]},
  uk:{name:'United Kingdom',desc:'Step into a world of royal heritage, historic castles, charming countryside, and vibrant cities including London, Edinburgh, and Bath.',details:[{label:'Duration',value:'8-12 Days'},{label:'Best Time',value:'May - Sep'},{label:'Language',value:'English'},{label:'Currency',value:'GBP'},{label:'Flight Time',value:'~9 Hours'},{label:'Offer',value:'2% OFF'}]},
  singapore:{name:'Singapore',desc:'A futuristic garden city with stunning skyline, world-class shopping, incredible food, and family-friendly attractions like Universal Studios.',details:[{label:'Duration',value:'4-6 Days'},{label:'Best Time',value:'Year Round'},{label:'Language',value:'English, Malay'},{label:'Currency',value:'SGD'},{label:'Flight Time',value:'~5.5 Hours'},{label:'Offer',value:'8% OFF'}]},
  thailand:{name:'Thailand',desc:'The Land of Smiles offers tropical beaches, ornate temples, vibrant street markets, and an incredible culinary journey.',details:[{label:'Duration',value:'5-8 Days'},{label:'Best Time',value:'Nov - Mar'},{label:'Language',value:'Thai'},{label:'Currency',value:'THB'},{label:'Flight Time',value:'~4 Hours'},{label:'Offer',value:'10% OFF'}]},
  malaysia:{name:'Malaysia',desc:'A melting pot of cultures with stunning islands, lush rainforests, modern cities, and delicious multi-ethnic cuisine.',details:[{label:'Duration',value:'5-7 Days'},{label:'Best Time',value:'Year Round'},{label:'Language',value:'Malay, English'},{label:'Currency',value:'MYR'},{label:'Flight Time',value:'~5 Hours'},{label:'Offer',value:'4% OFF'}]},
  europe:{name:'Europe',desc:'A grand tour through 10+ countries featuring art, architecture, cuisine, and culture. From Paris to Rome, Amsterdam to Barcelona.',details:[{label:'Duration',value:'15-21 Days'},{label:'Best Time',value:'Apr - Oct'},{label:'Language',value:'Multiple'},{label:'Currency',value:'EUR'},{label:'Flight Time',value:'~9 Hours'},{label:'Offer',value:'1% OFF'}]},
  usa:{name:'USA',desc:'From the Statue of Liberty to the Grand Canyon, Hollywood to Times Square - the American dream awaits you.',details:[{label:'Duration',value:'12-18 Days'},{label:'Best Time',value:'Mar - Nov'},{label:'Language',value:'English'},{label:'Currency',value:'USD'},{label:'Flight Time',value:'~16 Hours'},{label:'Offer',value:'6% OFF'}]},
  newzealand:{name:'New Zealand',desc:'Middle-earth come to life with majestic mountains, pristine lakes, adventure sports, and the warmest hospitality.',details:[{label:'Duration',value:'10-14 Days'},{label:'Best Time',value:'Dec - Mar'},{label:'Language',value:'English, Maori'},{label:'Currency',value:'NZD'},{label:'Flight Time',value:'~14 Hours'},{label:'Offer',value:'9% OFF'}]}
};

document.querySelectorAll('.destination-card').forEach(function(card){
  card.addEventListener('click',function(){
    var key=this.getAttribute('data-dest');
    var data=destData[key];
    if(!data||!modal)return;
    var img=document.getElementById('modal-image');
    var title=document.getElementById('modal-title');
    var desc=document.getElementById('modal-desc');
    var details=document.getElementById('modal-details');
    img.innerHTML='<img src="'+destImages[key]+'" alt="'+data.name+'" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--radius-xl) var(--radius-xl) 0 0;">';
    title.textContent=data.name;
    desc.textContent=data.desc;
    details.innerHTML='';
    data.details.forEach(function(d){
      details.innerHTML+='<div class="modal-detail-item"><strong>'+d.label+':</strong> '+d.value+'</div>';
    });
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  });
});

function closeModal(){
  if(modal){
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
}
document.querySelectorAll('[data-close-modal]').forEach(function(el){
  el.addEventListener('click',closeModal);
});
if(modal){
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});

/* ========== WhatsApp Helpers ========== */
var whatsappNumber='919115933586';
function openWhatsApp(message){
  var url='https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent(message);
  window.open(url,'_blank');
}
function buildBookingMessage(form){
  var name=form.querySelector('#book-name').value.trim();
  var phone=form.querySelector('#book-phone').value.trim();
  var email=form.querySelector('#book-email').value.trim();
  var service=form.querySelector('#book-service').value;
  var date=form.querySelector('#book-date').value;
  var destination=form.querySelector('#book-destination').value.trim();
  var message=form.querySelector('#book-message').value.trim();
  var serviceLabels={'international-flight':'International Flight','domestic-flight':'Domestic Flight','railway':'Railway Booking','bus':'Bus Reservation','hotel':'Hotel Booking','visa':'Visa Assistance','passport':'Passport Assistance','tour-package':'Tour Package','insurance':'Travel Insurance','consultation':'Travel Consultation'};
  var lines=['Hello! I would like to book a travel service.',''];
  lines.push('*Name:* '+name);
  if(phone) lines.push('*Phone:* '+phone);
  if(email) lines.push('*Email:* '+email);
  if(service) lines.push('*Service:* '+(serviceLabels[service]||service));
  if(date) lines.push('*Travel Date:* '+date);
  if(destination) lines.push('*Destination:* '+destination);
  if(message) lines.push('*Details:* '+message);
  lines.push('','Please get back to me with the details. Thank you!');
  return lines.join('\n');
}
function buildContactMessage(form){
  var name=form.querySelector('#contact-name').value.trim();
  var phone=form.querySelector('#contact-phone').value.trim();
  var email=form.querySelector('#contact-email').value.trim();
  var subject=form.querySelector('#contact-subject').value.trim();
  var message=form.querySelector('#contact-message').value.trim();
  var lines=['Hello! I need assistance with my travel plans.',''];
  lines.push('*Name:* '+name);
  if(phone) lines.push('*Phone:* '+phone);
  if(email) lines.push('*Email:* '+email);
  if(subject) lines.push('*Subject:* '+subject);
  if(message) lines.push('*Message:* '+message);
  lines.push('','Please respond at your earliest convenience. Thank you!');
  return lines.join('\n');
}

/* ========== Form Validation ========== */
function validateForm(form){
  var valid=true;
  form.querySelectorAll('[required]').forEach(function(input){
    input.style.borderColor='';
    if(!input.value.trim()){
      input.style.borderColor='#ef4444';
      valid=false;
    }
    if(input.type==='email'&&input.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){
      input.style.borderColor='#ef4444';
      valid=false;
    }
    if(input.type==='tel'&&input.value&&!/^[+]?[\d\s-]{7,15}$/.test(input.value)){
      input.style.borderColor='#ef4444';
      valid=false;
    }
  });
  return valid;
}

var bookingForm=document.getElementById('booking-form');
if(bookingForm){
  bookingForm.addEventListener('submit',function(e){
    e.preventDefault();
    if(validateForm(this)){
      var btn=this.querySelector('button[type="submit"]');
      var orig=btn.innerHTML;
      btn.innerHTML='<span>Opening WhatsApp...</span>';
      btn.disabled=true;
      var msg=buildBookingMessage(this);
      bookingForm.reset();
      setTimeout(function(){
        btn.innerHTML=orig;
        btn.disabled=false;
        openWhatsApp(msg);
      },600);
    }
  });
}

var contactForm=document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit',function(e){
    e.preventDefault();
    if(validateForm(this)){
      var btn=this.querySelector('button[type="submit"]');
      var orig=btn.innerHTML;
      btn.innerHTML='<span>Opening WhatsApp...</span>';
      btn.disabled=true;
      var msg=buildContactMessage(this);
      contactForm.reset();
      setTimeout(function(){
        btn.innerHTML=orig;
        btn.disabled=false;
        openWhatsApp(msg);
      },600);
    }
  });
}

/* ========== Back to Top ========== */
var backTop=document.getElementById('back-to-top');
if(backTop){
  window.addEventListener('scroll',function(){
    if(window.scrollY>500){backTop.classList.add('visible')}
    else{backTop.classList.remove('visible')}
  },{passive:true});
  backTop.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

/* ========== Ripple Effect ========== */
document.querySelectorAll('.ripple').forEach(function(btn){
  btn.addEventListener('click',function(e){
    var rect=this.getBoundingClientRect();
    var x=e.clientX-rect.left;
    var y=e.clientY-rect.top;
    var ripple=document.createElement('span');
    ripple.className='ripple-effect';
    ripple.style.left=x+'px';
    ripple.style.top=y+'px';
    ripple.style.width=ripple.style.height=Math.max(rect.width,rect.height)+'px';
    this.appendChild(ripple);
    setTimeout(function(){ripple.remove()},600);
  });
});

/* ========== Custom Cursor ========== */
var dot=document.getElementById('cursor-dot');
var ring=document.getElementById('cursor-ring');
if(dot&&ring&&window.matchMedia('(hover:hover)and (pointer:fine)').matches){
  var cx=0,cy=0,rx=0,ry=0;
  document.addEventListener('mousemove',function(e){
    cx=e.clientX;cy=e.clientY;
    dot.style.left=cx+'px';dot.style.top=cy+'px';
  });
  function animRing(){
    rx+=(cx-rx)*0.15;ry+=(cy-ry)*0.15;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,.service-card,.destination-card,.why-card,.faq-question').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add('hover')});
    el.addEventListener('mouseleave',function(){ring.classList.remove('hover')});
  });
}

/* ========== Live Chat ========== */
var chatToggle=document.getElementById('chat-toggle');
var chatWindow=document.getElementById('chat-window');
var chatClose=document.getElementById('chat-close');
var chatInput=document.getElementById('chat-input');
var chatSend=document.getElementById('chat-send');
var chatMessages=document.querySelector('.chat-messages');

if(chatToggle&&chatWindow){
  chatToggle.addEventListener('click',function(){
    chatWindow.classList.toggle('active');
    this.setAttribute('aria-expanded',chatWindow.classList.contains('active'));
    var badge=this.querySelector('.chat-badge');
    if(badge)badge.style.display='none';
  });
  if(chatClose){
    chatClose.addEventListener('click',function(){
      chatWindow.classList.remove('active');
      chatToggle.setAttribute('aria-expanded','false');
    });
  }
  function sendChat(){
    if(!chatInput||!chatMessages)return;
    var msg=chatInput.value.trim();
    if(!msg)return;
    var userDiv=document.createElement('div');
    userDiv.className='chat-msg user';
    userDiv.innerHTML='<p>'+msg.replace(/</g,'&lt;')+'</p><span class="chat-time">Just now</span>';
    chatMessages.appendChild(userDiv);
    chatInput.value='';
    chatMessages.scrollTop=chatMessages.scrollHeight;
    setTimeout(function(){
      var botDiv=document.createElement('div');
      botDiv.className='chat-msg bot';
      var replies=['Thank you for your message! Our team will get back to you shortly.','We appreciate your interest! How can we assist you with your travel plans?','Great question! Let me connect you with our travel expert for personalized assistance.'];
      botDiv.innerHTML='<p>'+replies[Math.floor(Math.random()*replies.length)]+'</p><span class="chat-time">Just now</span>';
      chatMessages.appendChild(botDiv);
      chatMessages.scrollTop=chatMessages.scrollHeight;
    },1200);
  }
  if(chatSend)chatSend.addEventListener('click',sendChat);
  if(chatInput){
    chatInput.addEventListener('keydown',function(e){if(e.key==='Enter')sendChat()});
  }
}

/* ========== Particles ========== */
(function(){
  var container=document.getElementById('hero-particles');
  if(!container)return;
  for(var i=0;i<30;i++){
    var p=document.createElement('div');
    p.style.cssText='position:absolute;width:'+Math.random()*4+1+'px;height:'+Math.random()*4+1+'px;background:rgba(255,255,255,'+(Math.random()*0.3+0.1)+');border-radius:50%;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;animation:particleFloat '+(Math.random()*20+10)+'s linear infinite;animation-delay:'+Math.random()*20+'s;';
    container.appendChild(p);
  }
  var style=document.createElement('style');
  style.textContent='@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) translateX('+(Math.random()*200-100)+'px);opacity:0}}';
  document.head.appendChild(style);
})();

})();
