const C = window.STORE_CONFIG || { shipping: {}, currency: 'د.ع' };
const $ = (s) => document.querySelector(s);
const money = (n) => new Intl.NumberFormat('ar-IQ').format(n) + ' ' + (C.currency || 'د.ع');

const PRODUCTS = [
  { id:'1', name:'فحمات فرامل أمامية أصلية', cat:'قطع غيار', price:45000, old:null, rating:4.9, stock:12, brand:'Textar', badge:'الأكثر مبيعاً', image:'https://cdn.awsli.com.br/2500x2500/2695/2695989/produto/263323770250568791e.jpg', fit:['Toyota','Hyundai','Kia'] },
  { id:'2', name:'فلتر زيت Premium للمحركات', cat:'زيوت', price:12000, old:null, rating:4.8, stock:35, brand:'Bosch', badge:'عرض', image:'https://cdn.autodoc.de/thumb?id=11156535&lng=en&m=0&n=0&rev=94078092', fit:['Toyota','Hyundai','Kia','Nissan'] },
  { id:'3', name:'زيت محرك 5W-30 تخليقي', cat:'زيوت', price:38000, old:45000, rating:4.9, stock:20, brand:'Selenia', badge:'خصم', image:'https://cdn.autodoc.de/thumb?id=27306321&lng=pt&m=0&n=0&rev=94078027', fit:['Toyota','Hyundai','Kia','Nissan'] },
  { id:'4', name:'شاحن سيارة سريع USB-C', cat:'كهربائيات', price:18000, old:null, rating:4.7, stock:50, brand:'UGREEN', badge:'جديد', image:'https://us.ugreen.com/cdn/shop/products/ugreen-130w-usb-c-car-charger-219754.png?v=1764234772&width=3840', fit:['Universal'] },
  { id:'5', name:'كمبروسر هواء رقمي', cat:'أدوات', price:32000, old:null, rating:4.8, stock:8, brand:'Avid Power', badge:'مميز', image:'https://ueeshop.ly200-cdn.com/u_file/UPBB/UPBB682/2412/11/products/CAP032-1.jpg', fit:['Universal'] },
  { id:'6', name:'دعاسات سيارة مقاومة للماء', cat:'إكسسوارات', price:65000, old:null, rating:4.9, stock:6, brand:'Motor Trend', badge:'جديد', image:'https://m.media-amazon.com/images/I/71tAwSrkwfL.jpg', fit:['Toyota','Hyundai','Kia'] },
  { id:'7', name:'جهاز فحص OBD2 ذكي', cat:'أدوات', price:42000, old:null, rating:4.8, stock:14, brand:'AUTOUTLET', badge:'الأكثر طلباً', image:'https://m.media-amazon.com/images/I/41XfoPw9V6L.jpg', fit:['Universal'] },
  { id:'8', name:'لمبات LED للسيارة H7', cat:'كهربائيات', price:28000, old:34000, rating:4.7, stock:25, brand:'DriveX', badge:'عرض', image:'https://mircaraudio.com/media/store/image0_111267.png', fit:['Universal'] }
];

const GOV = C.shipping || {};
let activeCat = 'all';
let sort = 'featured';
let cart = JSON.parse(localStorage.getItem('al3ab-cart') || '[]');
let favs = JSON.parse(localStorage.getItem('al3ab-favorites') || '[]');
let orders = JSON.parse(localStorage.getItem('al3ab-orders') || '[]');

const get = (id) => PRODUCTS.find((p) => String(p.id) === String(id));
function persist(){
  localStorage.setItem('al3ab-cart', JSON.stringify(cart));
  localStorage.setItem('al3ab-favorites', JSON.stringify(favs));
  localStorage.setItem('al3ab-orders', JSON.stringify(orders));
}
function subtotal(){ return cart.reduce((t,x) => t + (get(x.id)?.price || 0) * x.qty, 0); }
function imageMarkup(p, cls='product-real-image'){
  return `<img class="${cls}" src="${p.image}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
    <span class="image-fallback" aria-hidden="true">صورة المنتج</span>`;
}
function renderProducts(){
  const q = ($('#searchInput').value || '').trim().toLowerCase();
  let list = PRODUCTS.filter((p) => (activeCat === 'all' || p.cat === activeCat) && (!q || `${p.name} ${p.cat} ${p.brand}`.toLowerCase().includes(q)));
  if(sort === 'low') list = [...list].sort((a,b) => a.price - b.price);
  if(sort === 'high') list = [...list].sort((a,b) => b.price - a.price);
  if(sort === 'rating') list = [...list].sort((a,b) => b.rating - a.rating);
  $('#productGrid').innerHTML = list.length ? list.map((p) => `
    <article class="product" data-product="${p.id}">
      <div class="product-img real-product-img">
        <span class="badge">${p.badge}</span>
        <button class="fav ${favs.includes(p.id) ? 'active' : ''}" data-fav="${p.id}" aria-label="المفضلة">${favs.includes(p.id) ? '♥' : '♡'}</button>
        ${imageMarkup(p)}
      </div>
      <div class="product-body">
        <div class="product-cat">${p.cat} · ${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="stars">★★★★★ <span>(${p.rating})</span></div>
        <div class="stock ${p.stock < 10 ? 'low' : ''}">${p.stock < 10 ? `متبقي ${p.stock} فقط` : 'متوفر بالمخزن'}</div>
        <div class="price">${money(p.price)} ${p.old ? `<span class="old">${money(p.old)}</span>` : ''}</div>
        <button class="add" data-add="${p.id}">أضف للسلة +</button>
      </div>
    </article>`).join('') : '<div class="empty" style="grid-column:1/-1">🔎<b>ما لقينا منتجات مطابقة</b><span>جرّب اسم القطعة أو الفئة أو الماركة.</span></div>';
}
function renderCart(){
  $('#cartCount').textContent = cart.reduce((n,x) => n + x.qty, 0);
  $('#cartTotal').textContent = money(subtotal());
  $('#cartItems').innerHTML = cart.length ? cart.map((x) => { const p = get(x.id); return p ? `
    <div class="cart-row">
      <div class="cart-thumb real-thumb">${imageMarkup(p,'cart-real-image')}</div>
      <div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button data-minus="${p.id}">−</button><b>${x.qty}</b><button data-plus="${p.id}">+</button></div></div>
      <strong>${money(p.price * x.qty)}</strong>
    </div>` : ''; }).join('') : '<div class="empty">🛒<b>السلة فارغة</b><span>أضف المنتجات وتابع الطلب.</span></div>';
}
function openCart(){ $('#cartDrawer').classList.add('open'); $('#overlay').classList.add('open'); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#overlay').classList.remove('open'); }
function add(id){
  const p = get(id); if(!p || p.stock < 1) return;
  const x = cart.find(i => i.id === p.id);
  x ? x.qty = Math.min(x.qty + 1, p.stock) : cart.push({id:p.id, qty:1});
  persist(); renderCart(); openCart();
}
function qty(id,d){
  const x = cart.find(i => i.id === String(id)); if(!x) return;
  x.qty += d;
  if(x.qty < 1) cart = cart.filter(i => i.id !== String(id));
  const p = get(id); if(p) x.qty = Math.min(x.qty, p.stock);
  persist(); renderCart();
}
function modal(h){ $('#modalContent').innerHTML = h; $('#modal').classList.add('open'); }
function closeModal(){ $('#modal').classList.remove('open'); }
function filterCategory(c){ activeCat = c; renderProducts(); document.querySelector('#shop').scrollIntoView({behavior:'smooth'}); $('#categories').classList.remove('open'); }
function favorites(){
  const ps = favs.map(get).filter(Boolean);
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>المفضلة ❤️</h2>${ps.length ? `<div class="mini-list">${ps.map(p => `<button onclick="add('${p.id}');closeModal()">${imageMarkup(p,'mini-real-image')}<span>${p.name}</span><b>${money(p.price)}</b></button>`).join('')}</div>` : '<div class="empty">♡<b>المفضلة فارغة</b><span>اضغط القلب على المنتج.</span></div>'}`);
}
function showOrders(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>طلباتي 📦</h2>${orders.length ? `<div class="orders-list">${orders.map(o => `<div class="order-card"><b>${o.no}</b><span>${o.status}</span><strong>${money(o.total)}</strong><small>${new Date(o.date).toLocaleString('ar-IQ')}</small></div>`).join('')}</div>` : '<div class="empty">لا توجد طلبات بعد.</div>'}`);
}
function fitment(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>🔎 ساعدني أختار القطعة</h2><form class="checkout-form" id="fitForm"><div class="form-row"><select id="fitMake" required><option value="">الماركة</option><option>Toyota</option><option>Hyundai</option><option>Kia</option><option>Nissan</option></select><input required placeholder="الموديل"></div><div class="form-row"><input type="number" min="1980" max="2035" placeholder="السنة"><select id="fitCat" required><option value="">نوع القطعة</option>${['قطع غيار','زيوت','إكسسوارات','كهربائيات','أدوات'].map(x=>`<option>${x}</option>`).join('')}</select></div><button class="primary full">عرض القطع المناسبة</button></form>`);
  $('#fitForm').onsubmit = (e) => { e.preventDefault(); filterCategory($('#fitCat').value); closeModal(); };
}
function checkout(){
  if(!cart.length) return modal('<button class="close-modal" onclick="closeModal()">×</button><h2>السلة فارغة</h2>');
  const sub = subtotal();
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>إتمام الطلب</h2><div class="order-summary"><span>المنتجات</span><b>${money(sub)}</b></div><form class="checkout-form" id="orderForm"><div class="form-row"><input id="nm" required placeholder="الاسم الكامل"><input id="ph" required inputmode="tel" placeholder="رقم الهاتف 07XXXXXXXXX"></div><div class="form-row"><select id="gov" required><option value="">المحافظة</option>${Object.keys(GOV).map(g=>`<option>${g}</option>`).join('')}</select><input id="area" required placeholder="المنطقة / القضاء"></div><textarea id="addr" rows="3" required placeholder="العنوان بالتفصيل وأقرب نقطة دالة"></textarea><select id="pay"><option>الدفع عند الاستلام</option><option>تحويل إلكتروني</option></select><div class="shipping-line"><span>الشحن</span><b id="sf">اختر المحافظة</b></div><div class="shipping-line total"><span>الإجمالي</span><b id="ft">${money(sub)}</b></div><button class="primary full">تأكيد الطلب</button></form>`);
  $('#gov').onchange = () => { const fee = Number(GOV[$('#gov').value] || 0); $('#sf').textContent = money(fee); $('#ft').textContent = money(sub + fee); };
  $('#orderForm').onsubmit = (e) => {
    e.preventDefault();
    const ph = $('#ph').value.replace(/\s/g,'');
    if(!/^07\d{9}$/.test(ph)) return alert('رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم');
    const shipping = Number(GOV[$('#gov').value] || 0), no = 'CAR-' + Date.now().toString().slice(-8);
    const o = { no, date:new Date().toISOString(), name:$('#nm').value, phone:ph, governorate:$('#gov').value, area:$('#area').value, address:$('#addr').value, payment:$('#pay').value, total:sub+shipping, status:'قيد المراجعة', items:[...cart] };
    orders.unshift(o); cart = []; persist(); renderCart(); closeModal();
    modal(`<button class="close-modal" onclick="closeModal()">×</button><div class="success-box"><div>✅</div><h2>تم استلام طلبك</h2><p>رقم الطلب <b>${no}</b></p><p>الإجمالي <b>${money(o.total)}</b></p><button class="primary" onclick="closeModal();showOrders()">عرض الطلب</button></div>`);
  };
}
function track(){
  modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>📦 تتبع الطلب</h2><form class="checkout-form" id="tr"><input id="trn" required placeholder="CAR-12345678"><button class="primary full">بحث</button></form><div id="trr"></div>`);
  $('#tr').onsubmit = (e) => { e.preventDefault(); const o = orders.find(x => x.no === $('#trn').value.trim()); $('#trr').innerHTML = o ? `<div class="order-card"><b>${o.no}</b><span>${o.status}</span><strong>${money(o.total)}</strong></div>` : '<div class="empty">لم نجد هذا الطلب.</div>'; };
}
function productDetails(id){
  const p = get(id); if(!p) return;
  modal(`<button class="close-modal" onclick="closeModal()">×</button><div class="detail-photo">${imageMarkup(p,'detail-real-image')}</div><div class="product-cat">${p.cat} · ${p.brand}</div><h2>${p.name}</h2><div class="stars">★★★★★ <span>${p.rating} / 5</span></div><div class="detail-price">${money(p.price)} ${p.old ? `<span class="old">${money(p.old)}</span>` : ''}</div><p class="muted">صورة منتج حقيقية للاستخدام في واجهة المتجر التجريبية. تأكد من التوافق مع سيارتك قبل الشراء.</p><div class="fit-result">✓ ${p.stock} قطعة متوفرة حالياً</div><div class="detail-actions"><button class="primary" onclick="add('${p.id}');closeModal()">أضف للسلة</button><button class="secondary" onclick="closeModal()">إغلاق</button></div>`);
}
function account(){ modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>حسابي 👤</h2><p class="muted">الحساب الحقيقي جاهز للربط مع Supabase عند وضع مفاتيح المشروع في config.js.</p><button class="primary full" onclick="showOrders()">طلباتي (${orders.length})</button>`); }
function info(t,b){ modal(`<button class="close-modal" onclick="closeModal()">×</button><h2>${t}</h2><p class="info-text">${b}</p>`); }

$('#searchInput').oninput = renderProducts;
$('#searchBtn').onclick = () => { renderProducts(); document.querySelector('#shop').scrollIntoView({behavior:'smooth'}); };
$('#sortSelect').onchange = (e) => { sort = e.target.value; renderProducts(); };
$('#allProducts').onclick = () => filterCategory('all');
$('#offersBtn').onclick = () => filterCategory('زيوت');
$('#cartBtn').onclick = openCart;
$('#closeCart').onclick = closeCart;
$('#overlay').onclick = closeCart;
$('#checkoutBtn').onclick = checkout;
$('#accountBtn').onclick = account;
$('#footerAccount').onclick = (e) => { e.preventDefault(); account(); };
$('#ordersLink').onclick = (e) => { e.preventDefault(); showOrders(); };
$('#favoritesLink').onclick = (e) => { e.preventDefault(); favorites(); };
$('#trackOrderLink').onclick = (e) => { e.preventDefault(); track(); };
$('#returnsLink').onclick = (e) => { e.preventDefault(); info('الاستبدال والاسترجاع','يتم فحص المنتج عند الاستلام. للاستبدال تواصل مع خدمة العملاء مع رقم الطلب وحالة المنتج.'); };
$('#contactLink').onclick = (e) => { e.preventDefault(); info('تواصل معنا','خدمة العملاء: 0770 000 0000 — سيتم إضافة واتساب والبريد عند تجهيز بيانات المتجر.'); };
$('#fitmentBtn').onclick = fitment;
$('#mobileMenu').onclick = () => $('#categories').classList.toggle('open');
$('#modal').onclick = (e) => { if(e.target.id === 'modal') closeModal(); };

document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-cat]'); if(a){ e.preventDefault(); filterCategory(a.dataset.cat); }
  const addBtn = e.target.closest('[data-add]'); if(addBtn) add(addBtn.dataset.add);
  const fav = e.target.closest('[data-fav]'); if(fav){ const id = fav.dataset.fav; favs = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs,id]; persist(); renderProducts(); }
  const minus = e.target.closest('[data-minus]'); if(minus) qty(minus.dataset.minus,-1);
  const plus = e.target.closest('[data-plus]'); if(plus) qty(plus.dataset.plus,1);
  const card = e.target.closest('[data-product]'); if(card && !e.target.closest('button')) productDetails(card.dataset.product);
});

renderProducts();
renderCart();
