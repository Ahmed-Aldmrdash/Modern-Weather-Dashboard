🌤️ Modern Weather Dashboard - SUT Project (Pro Edition)
📌 1. Project Overview (نظرة عامة على المشروع)
مشروع Modern Weather Dashboard هو تطبيق ويب تفاعلي متكامل (Full-Stack Web Application) بمستوى احترافي. يهدف التطبيق إلى تقديم معلومات دقيقة ولحظية عن حالة الطقس لأي مدينة أو بقعة جغرافية حول العالم. يتميز التطبيق بواجهة مستخدم زجاجية عصرية (Glassmorphism)، وخرائط تفاعلية، وخلفيات تتغير ديناميكياً بناءً على حالة الطقس، بالإضافة إلى نظام ذكي لحفظ سجل البحث (Search History) في قاعدة بيانات فعلية على خادم (Live Server)، مما يسهل وصول المستخدم للمدن التي يهتم بها.

👥 2. Team Members & Roles (فريق العمل وتوزيع المهام)
تم تطوير هذا المشروع كعمل جماعي لطلاب جامعة السويدي للتكنولوجيا (SUT)، وتم توزيع المهام باحترافية كالتالي:

👑 Ahmed Aldmrdash (Team Leader & AI Engineer):

إدارة المشروع والتنسيق بين أعضاء الفريق ورفع الملفات على (GitHub).

تصميم واجهة المستخدم (UI/UX) وبناء الهيكل الأساسي (HTML/CSS) وتطبيق الـ Glassmorphism.

برمجة المميزات المتقدمة (Bonuses): دمج الخرائط التفاعلية (Leaflet.js)، نظام التنبيهات والنصائح الذكية (SweetAlert2)، والخلفيات الديناميكية (Real-life Images).

رفع الموقع وقاعدة البيانات على استضافة حقيقية (InfinityFree Deployment).

👨‍💻 Omar Ahmed Ramadan (Frontend & API Integrator):

التعامل مع الـ DOM Manipulation لعرض البيانات في الواجهة بشكل ديناميكي.

الربط مع الـ External API (OpenWeatherMap) باستخدام async/await و fetch.

استخراج ومعالجة بيانات الـ 5 أيام، والتعامل مع الإحداثيات (Latitude & Longitude) لربطها بالخريطة.

👩‍💻 Shimaa Hussien (Backend & Database Administrator):

تصميم وإنشاء قاعدة البيانات MySQL على البيئة المحلية (XAMPP) ثم نقلها لخادم الإنتاج (Production Server).

برمجة ملفات الـ PHP (save_city.php و get_history.php).

إدارة عمليات الحفظ والاسترجاع، وتطبيق خوارزمية (Latest on Top) لعرض أحدث عمليات البحث ومنع تكرار البيانات.

🛠️ 3. Technologies Used (التقنيات المستخدمة)
Frontend: HTML5, CSS3 (Custom Variables, Flexbox, Grid, Glassmorphism), Vanilla JavaScript (ES6+).

External Libraries: * Leaflet.js: لبرمجة الخرائط التفاعلية.

SweetAlert2: لنظام التنبيهات المظهري والإشعارات الذكية.

Backend: PHP 8.x.

Database: MySQL (Cloud Hosted).

Version Control: Git & GitHub.

Hosting & Deployment: InfinityFree (Live Server).

API: OpenWeatherMap API (Weather & Geocoding).

📡 4. The API Details (تفاصيل الـ API وكيفية استخدامه)
اعتمدنا في المشروع على OpenWeatherMap API كمصدر موثوق لبيانات الطقس.

الـ Endpoints المستخدمة:

Current Weather (By City): weather?q={city} (لجلب طقس اليوم الحالي بالاسم).

Current Weather (By Coordinates): weather?lat={lat}&lon={lon} (لجلب الطقس عند الضغط على أي نقطة في الخريطة أو عند تحديد موقع المستخدم).

5-Day Forecast: forecast?q={city} (لجلب توقعات الأيام الخمسة القادمة بفاصل 3 ساعات).

آلية المعالجة:
تم استخدام الـ Fetch API في الجافاسكريبت مع Promise.all لجلب بيانات الطقس الحالي والتوقعات بشكل متوازٍ (Parallel Fetching) لتقليل وقت التحميل، مع دمج مؤشرات تحميل (Loaders) من SweetAlert لضمان تجربة مستخدم سلسة.

⚙️ 5. Advanced Project Features & Logic (المميزات المتقدمة ومنطق العمل)
تم تنفيذ عدة أفكار برمجية (Logic) احترافية تجعل التطبيق يتفوق على المشاريع التقليدية:

Auto-Detect Location (الربط الجغرافي الذكي): عند فتح التطبيق، يتم استخدام navigator.geolocation للتعرف على موقع المستخدم تلقائياً، وجلب طقس مدينته فوراً دون الحاجة للبحث.

Interactive Map "Click to Explore" (الخريطة التفاعلية): تم دمج مكتبة Leaflet.js لعرض خريطة تفاعلية تطير (FlyTo Animation) للمدينة المبحوث عنها. الأهم من ذلك، يمكن للمستخدم الضغط على أي نقطة في العالم على الخريطة، وسيقوم الموقع تلقائياً بجلب إحداثياتها وعرض طقسها وتحديث الواجهة بالكامل.

Dynamic Real-Life Backgrounds (الخلفيات الحية الديناميكية): يتم تحليل حالة الطقس القادمة من الـ API (مثل: clear, rain, snow, mist) وتغيير خلفية الموقع بالكامل لصور حقيقية عالية الجودة. مع معالجة الحالات النادرة (Edge Cases) كالأعاصير والغبار، وإضافة طبقات شفافة (CSS Overlays) تتغير كثافتها حسب وضع الإضاءة لضمان وضوح النصوص.

Smart AI-like Advice (النصيحة الذكية): استخدام SweetAlert2 لإظهار إشعار ذكي (Toast Notification) يستمر لمدة 10 ثوانٍ يحلل الطقس ويعطي نصيحة للمستخدم (مثال: "الجو ممطر، لا تنسَ مظلتك!" أو "الجو حار، اشرب الكثير من الماء").

Dark/Light Mode Toggle: ميزة تغيير المظهر مع تغيير ألوان النصوص والطبقات الزجاجية والخلفيات لتناسب راحة العين، مع حفظ الخيار في localStorage.

Auto-Sorting History (ترتيب السجل ذكياً): عند البحث، يتم حفظ المدينة في قاعدة البيانات. إذا تم تكرار البحث، يقوم السيرفر بحذف السجل القديم وإدراجه كأحدث بحث (Latest on Top) ليظهر دائماً في أعلى القائمة الجانبية.

🗄️ 6. Database Architecture & Deployment (قاعدة البيانات والاستضافة)
تم ترقية المشروع من بيئة XAMPP المحلية إلى خادم إنتاج حقيقي (Production Server) لتسهيل الوصول إليه.

اسم قاعدة البيانات: weather_app (على استضافة InfinityFree).

الجدول الأساسي: search_history

id: INT (Primary Key, Auto Increment).

city_name: VARCHAR(255) (لحفظ اسم المدينة).

search_date: TIMESTAMP (يسجل وقت البحث تلقائياً لضبط الترتيب).

طريقة الربط (Client-Server Communication):
يقوم الـ Frontend بإرسال طلب POST إلى api/save_city.php لتخزين المدينة. ثم يقوم بطلب api/get_history.php لجلب السجل المحدث وعرضه مباشرة بدون إعادة تحميل الصفحة (AJAX-like behavior).

🐙 7. GitHub Workflow & Live Deployment (دورة العمل والاستضافة)
لضمان بيئة عمل هندسية صحيحة، تم اتباع الخطوات التالية:

Version Control: تم إنشاء مستودع (Repository) على GitHub لتتبع جميع التغييرات، مع رسائل Commit واضحة لكل ميزة تمت إضافتها (مثل: Added Leaflet Map, Integrated SweetAlert2).

Live Deployment: تم رفع ملفات المشروع بالكامل (HTML, CSS, JS, PHP) وقاعدة البيانات (MySQL) على استضافة InfinityFree المجانية، وتكوين ملف الاتصال db.php للربط بالسيرفر السحابي، ليصبح المشروع متاحاً للعرض والمناقشة الأكاديمية عبر رابط (URL) مباشر وحقيقي.
