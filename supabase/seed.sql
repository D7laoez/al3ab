-- Demo catalog for development. Replace these products with real inventory before production.
insert into public.brands(name,slug) values
('OEM','oem'),('Premium','premium'),('Ultra','ultra'),('Volt','volt'),('ProTool','protool'),('Lux','lux'),('ScanPro','scanpro'),('Bright','bright')
on conflict(slug) do nothing;

insert into public.products(name,slug,sku,description,price_iqd,compare_at_iqd,stock_qty,low_stock_threshold,featured,is_active)
select v.name,v.slug,v.sku,v.description,v.price_iqd,v.compare_at_iqd,v.stock_qty,3,v.featured,true
from (values
('فحمات فرامل أمامية أصلية','front-brake-pads','BRK-001','فحمات فرامل أمامية للاستخدام اليومي.',45000,null,12,true),
('فلتر زيت Premium للمحركات','premium-oil-filter','FLT-010','فلتر زيت عالي الاعتمادية.',12000,null,35,true),
('زيت محرك 5W-30 تخليقي','synthetic-5w30','OIL-530','زيت تخليقي للمحركات الحديثة.',38000,45000,20,true),
('شاحن سيارة سريع USB-C 45W','car-charger-45w','ELE-045','شاحن USB-C سريع للسيارة.',18000,null,50,false),
('كمبروسر هواء رقمي','digital-compressor','TLS-101','كمبروسر رقمي للطوارئ والصيانة.',32000,null,8,true),
('دعاسات سيارة جلدية فاخرة','luxury-mats','ACC-201','دعاسات داخلية فاخرة سهلة التنظيف.',65000,null,6,false),
('جهاز فحص OBD2 ذكي','smart-obd2','OBD-900','قارئ أعطال OBD2 للاستخدام المنزلي.',42000,null,14,true),
('لمبات LED للسيارة H7','led-h7','LED-H7','لمبات LED مقاس H7.',28000,34000,25,false)
) v(name,slug,sku,description,price_iqd,compare_at_iqd,stock_qty,featured) 
on conflict(slug) do nothing;
