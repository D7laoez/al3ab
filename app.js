const PRODUCTS = [
  {id:1,name:'فحمات فرامل أمامية أصلية',cat:'قطع غيار',price:45000,rating:4.9,icon:'🛞',badge:'الأكثر مبيعاً',stock:12,brand:'OEM',fit:['Toyota','Hyundai','Kia']},
  {id:2,name:'فلتر زيت Premium للمحركات',cat:'زيوت',price:12000,rating:4.8,icon:'🔩',badge:'عرض',stock:35,brand:'Premium',fit:['Toyota','Hyundai','Kia','Nissan']},
  {id:3,name:'زيت محرك 5W-30 تخليقي',cat:'زيوت',price:38000,old:45000,rating:4.9,icon:'🛢️',badge:'خصم',stock:20,brand:'Ultra',fit:['Toyota','Hyundai','Kia','Nissan']},
  {id:4,name:'شاحن سيارة سريع USB-C 45W',cat:'كهربائيات',price:18000,rating:4.7,icon:'🔌',badge:'جديد',stock:50,brand:'Volt',fit:['Universal']},
  {id:5,name:'كمبروسر هواء رقمي',cat:'أدوات',price:32000,rating:4.8,icon:'💨',badge:'مميز',stock:8,brand:'ProTool',fit:['Universal']},
  {id:6,name:'دعاسات سيارة جلدية فاخرة',cat:'إكسسوارات',price:65000,rating:4.9,icon:'🚘',badge:'جديد',stock:6,brand:'Lux',fit:['Toyota','Hyundai','Kia']},
  {id:7,name:'جهاز فحص OBD2 ذكي',cat:'أدوات',price:42000,rating:4.8,icon:'📟',badge:'الأكثر طلباً',stock:14,brand:'ScanPro',fit:['Universal']},
  {id:8,name:'لمبات LED للسيارة H7',cat:'كهربائيات',price:28000,old:34000,rating:4.7,icon:'💡',badge:'عرض',stock:25,brand:'Bright',fit:['Universal']}
];

const GOVERNORATES = {بغداد:5000,البصرة:10000,أربيل:10000,النجف:8000,كربلاء:8000,نينوى:10000,'ذي قار':10000,'الأنبار':10000,'ديالى':8000,'واسط':8000,'بابل':7000,'القادسية':8000,'ميسان':10000,'المثنى':10000,'صلاح الدين':10000,'كركوك':10000,'دهوك':12000,'السليمانية':12000};
let cart = JSON.parse(localStorage.getItem('al3ab-cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('al3ab-favorites') || '[]');
let orders = JSON.parse(localStorage.getItem('al3ab-orders') || '[]');
let activeCat = 'all';
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('ar-IQ').format(n) + ' د.ع';
const save = () => { localStorage.setItem('al3ab-cart', JSON.stringify(cart)); renderCart(); };
const saveFavorites = () => localStorage.setItem('al3ab-favorites', JSON.stringify(favorites));
const saveOrders = () => localStorage.setItem('al3ab-orders', JSON.stringify(orders));
const getProduct = id => PRODUCTS.find(p => p.id === Number(id));

function renderProducts(){
  const q = ($('#searchInput').value || '').trim().toLowerCase();
  let list = PRODUCTS.filter(p => (activeCat === 'all' || p.cat === activeCat) && (!q || p.name.toLowerCase().includes(q) || p.cat.includes(q) || p.brand.toLowerCase().includes(q)));
  const sort = $('#sortSelect').value;
  if(sort === 'low') list = [...list].sort((a,b)=>a.price-b.price);
  if(sort === 'high') list = [...list].sort((a,b)=>b.price-a.price);
  if(sort === 'rating') list = [...list].sort((a,b)=>b.rating-a.rating);
  $('#productGrid').innerHTML = list.length ? list.map(p => `
    <article class="product" data-product="${p.id}">
      <div class="product-img"><span class="badge">${p.badge}</span><button class="fav ${favorites.includes(p.id)?'active':''}" data-fav="${p.id}" aria-label="المفضلة">${favorites.includes(p.id)?'♥':'♡'}</button><span>${p.icon}</span></div>
      <div class="product-body"><div class="product-cat">${p.cat} · ${p.brand}</div><h3>${p.name}</h3><div class="stars">★★★★★ <span>(${p.rating})</span></div><div class="stock ${p.stock<10?'low':''}">${p.stock<10?'متبقي '+p.stock+' فقط':'متوفر بالمخزن'}</div><div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:''}</div><button class="add" data-add="${p.id}">أضف للسلة +</button></div>
    </article>`).join('') : '<div class="empty" style="grid-column:1/-1">🔎<b>ما لقينا منتجات مطابقة</b><span>جرّب اسم القطعة أو الفئة أو الماركة.</span></div>';
}

function renderCart(){
  const count = cart.reduce((a,x)=>a+x.qty,0);
  const subtotal = cart.reduce((a,x)=>{const p=getProduct(x.id);return a+(p?p.price*x.qty:0)},0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = money(subtotal);
  $('#cartItems').innerHTML = cart.length ? cart.map(x=>{const p=getProduct(x.id);if(!p)return '';return `<div class="cart-row"><div class="cart-thumb">${p.icon}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button data-minus="${p.id}">−</button><b>${x.qty}</b><button data-plus="${p.id}">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join('') : '<div class="empty">🛒<b>السلة فارغة</b><span>أضف المنتجات وتابع الطلب.</span></div>';
}
function openCart(){ $('#cartDrawer').classList.add('open'); $('#overlay').classList.add('open'); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#overlay').classList.remove('open'); }
function add(id){ const x=cart.find(i=>i.id===Number(id)); x?x.qty++:cart.push({id:Number(id),qty:1}); save(); openCart(); }
function filterCategory(c){ activeCat=c; renderProducts(); document.querySelector('#shop').scrollIntoView({behavior:'smooth'}); $('#categories').classList.remove('open'); }
function toggleFavorite(id){ id=Number(id); favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id]; saveFavorites(); renderProducts(); }
function modal(html){ $('#modalContent').innerHTML=html; $('#modal').classList.add('open'); }
function closeModal(){ $('#modal').classList.remove('open'); }

function productDetails(id){
  const p=getProduct(id); if(!p)return;
  modal(`<button class="close-modal" onclick="closeModal()">×</button><div class="product-detail"><div class="detail-art">${p.icon}</div><div><span class="eyebrow">${p.cat} · ${p.brand}</span><h2>${p.name}</h2><div class="stars">★★★★★ <span>${p.rating} / 5</span></div><div class="detail-price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:''}</div><p>قطعة مختارة للاستخدام اليومي مع خدمة دعم ومتابعة للطلب داخل العراق.</p><div class="fit-result">✓ ${p.stock} قطعة متوفرة حالياً · شحن لجميع المحافظات</div><div class="detail-actions"><button class="primary" onclick="add(${p.id});closeModal()">أضف للسلة</button><button class="ghost dark" onclick="toggleFavorite(${p.id});productDetails(${p.id})">${favorites.includes(p.id)?'♥ محفوظة':'♡ أضف للمفضلة'}</button></div></div></div>`);
}

function fitment(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>🔎 ساعدني أختار القطعة</h2><p class="muted">اختار سيارتك ونوع القطعة حتى نضيّق النتائج عليك.</p><form class="checkout-form" id="fitForm"><div class="form-row"><select required id="fitMake"><option value="">الماركة</option><option>Toyota</option><option>Hyundai</option><option>Kia</option><option>Nissan</option></select><input required id="fitModel" placeholder="الموديل مثل Elantra"></div><div class="form-row"><select required><option value="">السنة</option>${Array.from({length:17},(_,i)=>`<option>${2026-i}</option>`).join('')}</select><select required id="fitCat"><option value="">نوع القطعة</option>${['قطع غيار','زيوت','إكسسوارات','كهربائيات','أدوات'].map(x=>`<option>${x}</option>`).join('')}</select></div><button class="primary full">عرض القطع المناسبة</button></form>`);
  $('#fitForm').onsubmit=e=>{e.preventDefault();const make=$('#fitMake').value,cat=$('#fitCat').value;activeCat=cat;$('#searchInput').value='';renderProducts();closeModal();document.querySelector('#shop').scrollIntoView({behavior:'smooth'});const matches=PRODUCTS.filter(p=>(p.fit.includes(make)||p.fit.includes('Universal'))&&p.cat===cat);setTimeout(()=>modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>النتيجة</h2><p>لقينا <b>${matches.length}</b> منتج مناسب مبدئياً لـ ${make} ضمن فئة ${cat}.</p><button class="primary full" onclick="closeModal();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})">تصفح النتائج</button>`),250)};
}

function checkout(){
  if(!cart.length)return modal('<button class="close-modal" onclick="closeModal()">×</button><h2>السلة فارغة</h2><p class="muted">أضف منتجاً واحداً على الأقل قبل إتمام الطلب.</p>');
  const subtotal=cart.reduce((a,x)=>a+getProduct(x.id).price*x.qty,0);
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>إتمام الطلب</h2><div class="order-summary"><span>المنتجات</span><b>${money(subtotal)}</b></div><form class="checkout-form" id="orderForm"><div class="form-row"><input id="customerName" required placeholder="الاسم الكامل"><input id="phone" required inputmode="tel" placeholder="رقم الهاتف 07XXXXXXXXX"></div><div class="form-row"><select id="governorate" required><option value="">المحافظة</option>${Object.entries(GOVERNORATES).map(([g,v])=>`<option value="${g}" data-shipping="${v}">${g}</option>`).join('')}</select><input id="area" required placeholder="المنطقة / القضاء"></div><textarea id="address" rows="3" required placeholder="العنوان بالتفصيل وأقرب نقطة دالة"></textarea><select id="payment"><option>الدفع عند الاستلام</option><option>تحويل إلكتروني — سيتم التواصل للتأكيد</option></select><div class="shipping-line"><span>الشحن</span><b id="shippingValue">اختر المحافظة</b></div><div class="shipping-line total"><span>الإجمالي</span><b id="finalTotal">${money(subtotal)}</b></div><button class="primary full">تأكيد الطلب</button></form>`);
  $('#governorate').onchange=()=>{const fee=GOVERNORATES[$('#governorate').value]||0;$('#shippingValue').textContent=money(fee);$('#finalTotal').textContent=money(subtotal+fee)};
  $('#orderForm').onsubmit=e=>{e.preventDefault();const phone=$('#phone').value.replace(/\s/g,'');if(!/^07\d{9}$/.test(phone))return alert('رقم الهاتف العراقي يجب أن يكون 11 رقماً ويبدأ بـ 07');const shipping=GOVERNORATES[$('#governorate').value]||0;const no='CAR-'+Date.now().toString().slice(-8);orders.unshift({id:no,date:new Date().toISOString(),name:$('#customerName').value,phone,governorate:$('#governorate').value,area:$('#area').value,address:$('#address').value,payment:$('#payment').value,items:[...cart],subtotal,shipping,total:subtotal+shipping,status:'قيد المراجعة'});saveOrders();cart=[];save();closeCart();modal(`<button class="close-modal" onclick="closeModal()">×</button><div class="success-box"><div>✅</div><h2>تم استلام طلبك بنجاح</h2><p>رقم الطلب: <b>${no}</b></p><p class="muted">سيتم التواصل معك لتأكيد الطلب والتوصيل.</p><button class="primary" onclick="closeModal();showOrders()">عرض طلباتي</button></div>`)};
}

function account(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>حسابي</h2><div class="account-tabs"><button class="active">دخول سريع</button><button onclick="showOrders()">طلباتي (${orders.length})</button><button onclick="showFavorites()">المفضلة (${favorites.length})</button></div><form class="checkout-form" id="loginForm"><input required placeholder="رقم الهاتف"><input required type="password" placeholder="كلمة المرور"><button class="primary full">تسجيل الدخول</button></form><p class="muted small">حالياً يمكنك تجربة المتجر محلياً. سيتم ربط الحسابات الحقيقية بـ Supabase في مرحلة البنية الخلفية.</p>`);
  $('#loginForm').onsubmit=e=>{e.preventDefault();alert('واجهة الحساب جاهزة، وسيتم تفعيل المصادقة الحقيقية عند ربط قاعدة البيانات.');};
}
function showOrders(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>📦 طلباتي</h2>${orders.length?orders.map(o=>`<div class="order-card"><div><b>${o.id}</b><span>${new Date(o.date).toLocaleDateString('ar-IQ')}</span></div><strong>${money(o.total)}</strong><small>${o.governorate} · ${o.status}</small></div>`).join(''):'<div class="empty">📦<b>لا توجد طلبات بعد</b><span>طلباتك ستظهر هنا بعد إتمام الشراء.</span></div>'}`);
}
function showFavorites(){
  const list=PRODUCTS.filter(p=>favorites.includes(p.id));
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>♥ المفضلة</h2>${list.length?list.map(p=>`<div class="fav-row"><span>${p.icon}</span><div><b>${p.name}</b><small>${money(p.price)}</small></div><button class="add" onclick="add(${p.id});closeModal()">أضف للسلة</button></div>`).join(''):'<div class="empty">♡<b>المفضلة فارغة</b><span>اضغط القلب على أي منتج لحفظه.</span></div>'}`);
}

$('#searchInput').oninput=renderProducts;
$('#searchBtn').onclick=renderProducts;
$('#sortSelect').onchange=renderProducts;
$('#allProducts').onclick=()=>filterCategory('all');
$('#cartBtn').onclick=openCart;
$('#closeCart').onclick=closeCart;
$('#overlay').onclick=closeCart;
$('#checkoutBtn').onclick=checkout;
$('#accountBtn').onclick=account;
$('#footerAccount').onclick=e=>{e.preventDefault();account()};
$('#fitmentBtn').onclick=fitment;
$('#mobileMenu').onclick=()=>$('#categories').classList.toggle('open');
$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};

document.addEventListener('click',e=>{
  const cat=e.target.closest('[data-cat]'); if(cat){e.preventDefault();filterCategory(cat.dataset.cat);return;}
  const addBtn=e.target.closest('[data-add]'); if(addBtn){e.stopPropagation();add(addBtn.dataset.add);return;}
  const fav=e.target.closest('[data-fav]'); if(fav){e.stopPropagation();toggleFavorite(fav.dataset.fav);return;}
  const minus=e.target.closest('[data-minus]'); if(minus){const q=cart.find(i=>i.id===Number(minus.dataset.minus));if(q){q.qty--;if(q.qty<1)cart=cart.filter(i=>i.id!==q.id);save()}return;}
  const plus=e.target.closest('[data-plus]'); if(plus){add(plus.dataset.plus);return;}
  const product=e.target.closest('[data-product]'); if(product)productDetails(product.dataset.product);
});

renderProducts();
renderCart();
