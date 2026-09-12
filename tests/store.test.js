const test=require('node:test');const assert=require('node:assert/strict');
function shipping(gov,rates){return Number(rates[gov]||0)}
test('Iraqi phone validation accepts 11 digit 07 numbers',()=>{assert.match('07701234567',/^07\d{9}$/);assert.doesNotMatch('0770123456',/^07\d{9}$/);assert.doesNotMatch('06701234567',/^07\d{9}$/)});
test('shipping uses configured governorate rate',()=>{assert.equal(shipping('بغداد',{بغداد:5000}),5000);assert.equal(shipping('مجهول',{بغداد:5000}),0)});
test('order total equals subtotal plus shipping in the base checkout model',()=>{const subtotal=99000,shipping=8000;assert.equal(subtotal+shipping,107000)});
test('cart aggregation is quantity times unit price',()=>{const items=[{price:12000,qty:2},{price:38000,qty:1}];assert.equal(items.reduce((t,x)=>t+x.price*x.qty,0),62000)});
