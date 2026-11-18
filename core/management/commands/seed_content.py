"""Populate the site with its initial content (idempotent: only fills empty tables)."""
from django.core.management.base import BaseCommand

from core.models import (CaseStudy, Certification, Education, Experience, OpenSourceProject, Post,
                         Product, Service, SiteSettings, SkillGroup, Stat)

GH = "https://github.com/arazshah"


class Command(BaseCommand):
    help = "Seed initial content"

    def handle(self, *a, **kw):
        if not SiteSettings.objects.exists():
            SiteSettings.objects.create(
                headline_en="Geospatial AI Engineer · Backend Engineer",
                headline_fa="مهندس هوش مکانی (GeoAI) · مهندس بک‌اند",
                tagline_en="I build natural-language spatial analysis systems, high-performance geospatial APIs and managed PostGIS infrastructure — turning maps, data and LLMs into reliable software.",
                tagline_fa="سامانه‌های تحلیل مکانی با زبان طبیعی، APIهای مکانی پرکارایی و زیرساخت مدیریت‌شده‌ی PostGIS می‌سازم — نقشه، داده و مدل‌های زبانی را به نرم‌افزاری قابل‌اعتماد تبدیل می‌کنم.",
                about_en="""I'm a geospatial AI engineer with **12+ years** in software engineering, backend work since 2016 and GIS development since 2018. I work where Python backends, spatial databases and AI meet.

I'm the **author and sole maintainer of s3geo** (Smart Spatial System), an MIT-licensed GeoAI backend that turns English or Persian questions into validated, traceable spatial workflows. I'm also the **founder of postgis.ir**, a managed cloud PostGIS service, and I build the Model Context Protocol (MCP) infrastructure that lets AI agents work with GIS tools.

By day I'm a Geospatial Backend Developer at Spatial Science Innovators and a Senior Software Engineer at Alborz Insurance Company, where I design Python backends, risk-assessment and claims-visualisation capabilities and lead a technical team. Earlier I researched OGC/SWE Sensor Web systems.

I'm an **OSGeo advocate**, a contributor to open-source GIS (including Persian localisation of GeoLibre) and a Persian-language technical educator through Bookane and Python-for-GIS training.

**M.Sc. in GIS** (Islamic Azad University, Science and Research Branch) and **B.Sc. in Computer Engineering**. Based in Urmia, Iran — open to relocation.""",
                about_fa="""مهندس هوش مکانی هستم با بیش از **۱۲ سال** سابقه‌ی مهندسی نرم‌افزار؛ کار بک‌اند را از ۲۰۱۶ و توسعه‌ی GIS را از ۲۰۱۸ آغاز کردم. در نقطه‌ی تلاقی بک‌اندهای پایتون، پایگاه‌داده‌های مکانی و هوش مصنوعی کار می‌کنم.

**نویسنده و نگهدارنده‌ی تنهای s3geo** (سامانه‌ی هوشمند مکانی) هستم؛ یک بک‌اند GeoAI با مجوز MIT که پرسش‌های فارسی یا انگلیسی را به گردش‌کارهای مکانیِ اعتبارسنجی‌شده و ردیابی‌پذیر تبدیل می‌کند. همچنین **بنیان‌گذار postgis.ir** هستم، یک سرویس ابریِ مدیریت‌شده‌ی PostGIS، و زیرساخت Model Context Protocol (MCP) را می‌سازم تا عامل‌های هوش مصنوعی بتوانند با ابزارهای GIS کار کنند.

در حال حاضر توسعه‌دهنده‌ی بک‌اند مکانی در Spatial Science Innovators و مهندس ارشد نرم‌افزار در بیمه البرز هستم؛ جایی که بک‌اندهای پایتون، قابلیت‌های ارزیابی ریسک و نمایش خسارت را طراحی می‌کنم و یک تیم فنی را هدایت می‌کنم. پیش‌تر روی سامانه‌های Sensor Web مبتنی بر OGC/SWE پژوهش و توسعه می‌کردم.

**مدافع OSGeo** هستم، در پروژه‌های متن‌باز GIS (از جمله فارسی‌سازی GeoLibre) مشارکت دارم و از راه «بوکانه» و دوره‌های Python for GIS آموزشگر فنی فارسی‌زبانم.

**کارشناسی ارشد GIS** (دانشگاه آزاد اسلامی، واحد علوم و تحقیقات) و **کارشناسی مهندسی کامپیوتر**. ساکن ارومیه، ایران — آماده‌ی مهاجرت کاری.""",
                now_en="""- Maintaining and extending **s3geo** — more plugins, more reproducible case studies (Lake Urmia shrinkage, Urmia real estate).
- Building MCP servers that expose GIS tools to AI agents at Spatial Science Innovators.
- Growing **postgis.ir** and writing Persian-language PostGIS tutorials.
- Writing about GeoAI, reproducibility and LLM planning for spatial analysis.""",
                now_fa="""- نگهداری و توسعه‌ی **s3geo** — پلاگین‌های بیشتر و مطالعات موردی تکرارپذیرتر (کوچک‌شدن دریاچه ارومیه، بازار مسکن ارومیه).
- ساخت سرورهای MCP که ابزارهای GIS را در اختیار عامل‌های هوش مصنوعی می‌گذارند.
- رشد **postgis.ir** و نوشتن آموزش‌های فارسی PostGIS.
- نوشتن درباره‌ی GeoAI، تکرارپذیری و برنامه‌ریزی LLM برای تحلیل مکانی.""",
                meta_description_en="Araz Shahkarami — Geospatial AI engineer. Creator of s3geo (Smart Spatial System), founder of postgis.ir. Python, PostGIS, GeoAI, MCP.",
                meta_description_fa="آراز شاه‌کرمی — مهندس هوش مکانی. سازنده‌ی s3geo و بنیان‌گذار postgis.ir. پایتون، PostGIS، GeoAI و MCP.",
                osgeo_url="https://wiki.osgeo.org/wiki/User:Arazshah",
            )

        if not Stat.objects.exists():
            for i, (v, en, fa) in enumerate([
                ("12+", "years in software", "سال سابقه‌ی نرم‌افزار"),
                ("100", "spatial capabilities in s3geo", "قابلیت مکانی در s3geo"),
                ("1,800+", "automated tests in CI", "تست خودکار در CI"),
                ("20/20", "identical expert-result LLM runs", "اجرای LLM با نتیجه‌ی یکسان"),
                ("~20×", "faster raster pipeline", "سرعت بیشتر پایپ‌لاین رستر"),
            ]):
                Stat.objects.create(value=v, label_en=en, label_fa=fa, order=i)

        if not Product.objects.exists():
            P = Product.Status
            Product.objects.create(
                slug="s3geo", name="Smart Spatial System (s3geo)", featured=True, order=0, status=P.ACTIVE, year="2026 – Present",
                kind_en="GeoAI · Flagship", kind_fa="GeoAI · محصول اصلی",
                tagline_en="Ask a spatial question in English or Persian — get a validated, traceable workflow, map layers and reports.",
                tagline_fa="پرسش مکانی را به فارسی یا انگلیسی بپرسید — گردش‌کار اعتبارسنجی‌شده و ردیابی‌پذیر، لایه‌های نقشه و گزارش بگیرید.",
                role_en="Author & sole maintainer", role_fa="نویسنده و نگهدارنده‌ی تنها",
                stack="Python, FastAPI, React, PostGIS, MCP, GDAL, pytest",
                url="https://s3geo.com", source_url=f"{GH}/smart_spatial_system", package_url="https://pypi.org/project/smart-spatial-system/",
                description_en="""**s3geo** is an MIT-licensed, plugin-based GeoAI backend with a React workbench. A question is turned into a structured query spec, planned as a **DAG of spatial operations** and executed by plugins.

- **Validated before execution** — every LLM-generated plan is checked first, and every plugin run keeps an execution trace.
- **Deterministic + LLM paths** side by side, so plans can be compared.
- **English and Persian** questions.
- **MCP server** exposing each capability as a tool for AI agents.
- **100 capabilities** across vector overlay, spatial statistics, decision analysis (AHP, TOPSIS), raster and terrain, network routing, charts and data connectors.
- Data from raster/vector uploads, CSV, WMS, WFS, PostGIS and remote URLs.
- **1,800+ automated tests** in CI.

```bash
pip install "smart-spatial-system[raster,pdf]"
smart-spatial-api serve --port 8000
```

In a case study on health-care access in Istanbul, the system reproduced the expert result in **20 of 20 unhinted LLM runs (Jaccard 1.0)**; a Cairo raster pipeline became **~20× faster** (18.5 min → 55 s) with identical results.""",
                description_fa="""**s3geo** یک بک‌اند GeoAI پلاگین‌محور با مجوز MIT و میزکار React است. پرسش به یک مشخصه‌ی ساختاریافته تبدیل می‌شود، به‌صورت **گراف (DAG) عملیات مکانی** برنامه‌ریزی می‌شود و پلاگین‌ها اجرایش می‌کنند.

- **اعتبارسنجی پیش از اجرا** — هر برنامه‌ی تولیدشده توسط LLM ابتدا بررسی می‌شود و هر اجرای پلاگین ردّ اجرا (trace) دارد.
- **مسیر قطعی و مسیر LLM** در کنار هم برای مقایسه‌ی برنامه‌ها.
- پرسش به **فارسی و انگلیسی**.
- **سرور MCP** که هر قابلیت را به‌صورت ابزار برای عامل‌های هوش مصنوعی ارائه می‌کند.
- **۱۰۰ قابلیت**: هم‌پوشانی برداری، آمار مکانی، تحلیل تصمیم (AHP و TOPSIS)، رستر و زمین، مسیریابی شبکه، نمودار و اتصال به منابع داده.
- داده از آپلود رستر/برداری، CSV، WMS، WFS، PostGIS و آدرس‌های راه‌دور.
- **بیش از ۱٬۸۰۰ تست خودکار** در CI.

```bash
pip install "smart-spatial-system[raster,pdf]"
smart-spatial-api serve --port 8000
```

در مطالعه‌ی دسترسی به خدمات سلامت در استانبول، سامانه نتیجه‌ی کارشناس را در **۲۰ از ۲۰ اجرای بدون راهنمایی LLM** بازتولید کرد (Jaccard 1.0)؛ و پایپ‌لاین رستر قاهره **حدود ۲۰ برابر سریع‌تر** شد (۱۸٫۵ دقیقه ← ۵۵ ثانیه) با نتایج یکسان.""")
            Product.objects.create(
                slug="postgis-ir", name="postgis.ir", featured=True, order=1, status=P.ACTIVE, year="Founder & developer",
                kind_en="Spatial database-as-a-service", kind_fa="پایگاه‌داده‌ی مکانی به‌عنوان سرویس",
                tagline_en="Managed cloud PostGIS — a ready database in under a minute.",
                tagline_fa="PostGIS ابریِ مدیریت‌شده — پایگاه‌داده‌ی آماده در کمتر از یک دقیقه.",
                role_en="Founder & developer", role_fa="بنیان‌گذار و توسعه‌دهنده",
                stack="PostgreSQL, PostGIS, Docker, Linux, Python",
                url="https://postgis.ir",
                description_en="""**postgis.ir** is a managed cloud PostGIS service for GIS teams, students and developers.

- Self-service database provisioning in **under a minute**
- SSL, extension management, resource limits and **daily backups**
- Connectivity guides for **QGIS, GeoServer and Python**, map/WMS publishing workflows
- Persian-language technical tutorials""",
                description_fa="""**postgis.ir** یک سرویس ابریِ مدیریت‌شده‌ی PostGIS برای تیم‌های GIS، دانشجویان و توسعه‌دهندگان است.

- ساخت خودکار پایگاه‌داده در **کمتر از یک دقیقه**
- SSL، مدیریت افزونه‌ها، محدودیت منابع و **بکاپ روزانه**
- راهنمای اتصال **QGIS، GeoServer و Python** و گردش‌کار انتشار نقشه/WMS
- آموزش‌های فنی به زبان فارسی""")
            Product.objects.create(
                slug="geochat-platform", name="geochat-platform", featured=True, order=2, status=P.ACTIVE,
                kind_en="GeoAI kernel · SDK", kind_fa="هسته‌ی GeoAI · SDK",
                tagline_en="A plugin-based GeoAI kernel and Python SDK for parsing, routing, planning and executing natural-language spatial queries.",
                tagline_fa="هسته‌ی پلاگین‌محور GeoAI و SDK پایتون برای تجزیه، مسیریابی، برنامه‌ریزی و اجرای پرسش‌های مکانی زبان طبیعی.",
                role_en="Author", role_fa="نویسنده", stack="Python, MCP, LLM planning, plugins",
                source_url=f"{GH}/geochat-platform",
                description_en="The platform s3geo is built on: a domain-agnostic kernel with a plugin SDK, an execution engine and **spatial Model Context Protocol (MCP)** infrastructure that lets AI agents understand and interact with GIS systems — bridging the semantic gap between traditional GIS and AI models.\n\nIt uses a three-layer MCP architecture: **Tools, Resources and Prompts**.",
                description_fa="پلتفرمی که s3geo روی آن ساخته شده: یک هسته‌ی مستقل از دامنه با SDK پلاگین، موتور اجرا و زیرساخت **Model Context Protocol (MCP) مکانی** که به عامل‌های هوش مصنوعی امکان درک و تعامل با سامانه‌های GIS را می‌دهد — و شکاف معنایی میان GIS سنتی و مدل‌های هوش مصنوعی را پر می‌کند.\n\nمعماری سه‌لایه‌ی MCP: **ابزارها، منابع و پرامپت‌ها**.")
            Product.objects.create(
                slug="mapathon", name="Mapathon", featured=True, order=3, status=P.ACTIVE,
                kind_en="Persian geospatial assistant", kind_fa="دستیار مکانی فارسی",
                tagline_en="A Persian map assistant that answers plain-language questions with places, routes and spatial results.",
                tagline_fa="دستیار نقشه‌ی فارسی که به پرسش‌های ساده با مکان، مسیر و نتایج مکانی پاسخ می‌دهد.",
                role_en="Creator", role_fa="سازنده", stack="Python, LLM orchestration, OpenStreetMap",
                url="https://mapathon.ir", source_url=f"{GH}/mapathon-ai",
                description_en="The forerunner of s3geo: a Persian/English natural-language geospatial query system for Iran, returning places, routes and spatial answers on a map. Its plugin-based design grew into geochat-platform.",
                description_fa="پیش‌درآمد s3geo: سامانه‌ی پرسش مکانی زبان طبیعی (فارسی/انگلیسی) برای ایران که مکان‌ها، مسیرها و پاسخ‌های مکانی را روی نقشه نشان می‌دهد. طراحی پلاگین‌محور آن به geochat-platform تبدیل شد.")
            Product.objects.create(
                slug="geo-araz", name="Geo Araz", order=4, status=P.ACTIVE,
                kind_en="Free web toolkit", kind_fa="جعبه‌ابزار وب رایگان",
                tagline_en="A free Persian toolkit for everyday map tasks.",
                tagline_fa="جعبه‌ابزار رایگان فارسی برای کارهای روزمره‌ی نقشه.",
                role_en="Creator", role_fa="سازنده", stack="JavaScript, Leaflet, GeoJSON",
                url="https://geo.araz.me", source_url=f"{GH}/geo-araz",
                description_en="Measuring distance and area, EPSG coordinate conversion, geocoding, routing and GeoJSON/WKT export — in Persian, in the browser.",
                description_fa="اندازه‌گیری فاصله و مساحت، تبدیل مختصات EPSG، ژئوکدینگ، مسیریابی و خروجی GeoJSON/WKT — به فارسی و در مرورگر.")
            Product.objects.create(
                slug="bookane", name="Bookane", order=5, status=P.ACTIVE,
                kind_en="Education platform", kind_fa="پلتفرم آموزشی",
                tagline_en="An open-source Persian tech-education platform with searchable right-to-left tutorials.",
                tagline_fa="پلتفرم متن‌باز آموزش فناوری به فارسی با آموزش‌های راست‌به‌چین و قابل جست‌وجو.",
                role_en="Creator", role_fa="سازنده", stack="Python, Django, AI-assisted authoring",
                url="https://bookane.ir", source_url=f"{GH}/bookane",
                description_en="Programming, backend engineering, web development, DevOps, GIS, databases and AI — taught in Persian, with an AI tool that helps draft lessons.",
                description_fa="برنامه‌نویسی، مهندسی بک‌اند، توسعه‌ی وب، دواپس، GIS، پایگاه‌داده و هوش مصنوعی — به فارسی، با ابزار هوش مصنوعی برای پیش‌نویس درس‌ها.")
            Product.objects.create(
                slug="rsynx", name="Rsynx", order=6, status=P.ACTIVE,
                kind_en="Developer tool · CLI", kind_fa="ابزار توسعه‌دهنده · CLI",
                tagline_en="Live terminal sharing between two people, end-to-end encrypted — no SSH, no public IP.",
                tagline_fa="اشتراک زنده‌ی ترمینال بین دو نفر با رمزنگاری سرتاسری — بدون SSH و IP عمومی.",
                role_en="Creator", role_fa="سازنده", stack="TypeScript, WebSocket, E2E encryption",
                url="https://rsynx.ir", source_url=f"{GH}/rsynx",
                description_en="A terminal-first tool for pairing and support sessions.", description_fa="ابزاری ترمینال‌محور برای جلسات پیر-برنامه‌نویسی و پشتیبانی.")
            Product.objects.create(
                slug="nvise", name="nvise", order=7, status=P.BETA,
                kind_en="Insurance tech · SaaS", kind_fa="فناوری بیمه · SaaS",
                tagline_en="A bot-first SaaS that turns conversational field notes into structured, evidence-backed loss-adjusting reports.",
                tagline_fa="SaaS مبتنی بر ربات که یادداشت‌های میدانی گفت‌وگومحور را به گزارش ساختاریافته‌ی مستند خسارت تبدیل می‌کند.",
                role_en="Creator", role_fa="سازنده", stack="Python, LLM, speech-to-text",
                source_url=f"{GH}/nvise",
                description_en="Draws on years of insurance-domain engineering: field notes — including voice notes — become professional reports.",
                description_fa="برگرفته از سال‌ها تجربه‌ی مهندسی در حوزه‌ی بیمه: یادداشت‌های میدانی — از جمله صوتی — به گزارش حرفه‌ای تبدیل می‌شوند.")

        if not CaseStudy.objects.exists():
            C = CaseStudy.Status
            for i, (slug, city, cfa, la, lo, st, ten, tfa, sen, sfa, ren, rfa, repo) in enumerate([
                ("istanbul-health-access", "Istanbul", "استانبول", 41.0082, 28.9784, C.COMPLETE,
                 "Health-care access in Istanbul", "دسترسی به خدمات سلامت در استانبول",
                 "Can an LLM, with no hints, plan the same spatial analysis an expert would? A reproducibility study of health-facility accessibility.",
                 "آیا یک LLM بدون راهنمایی می‌تواند همان تحلیل مکانی کارشناس را برنامه‌ریزی کند؟ مطالعه‌ی تکرارپذیری دسترسی به مراکز درمانی.",
                 "20/20 unhinted runs · Jaccard 1.0", "۲۰ از ۲۰ اجرا · Jaccard 1.0", "smart-spatial-istanbul-health-access"),
                ("cairo-vegetation-change", "Cairo", "قاهره", 30.0444, 31.2357, C.COMPLETE,
                 "Vegetation change in Cairo", "تغییر پوشش گیاهی قاهره",
                 "A raster time-series pipeline for vegetation change, optimised without changing a single result.",
                 "پایپ‌لاین سری‌زمانی رستر برای تغییر پوشش گیاهی که بدون تغییر هیچ نتیجه‌ای بهینه شد.",
                 "~20× faster · 18.5 min → 55 s", "حدود ۲۰ برابر سریع‌تر · ۱۸٫۵ دقیقه ← ۵۵ ثانیه", "smart-spatial-cairo-vegetation-change"),
                ("vienna-accessibility", "Vienna", "وین", 48.2082, 16.3738, C.REFERENCE,
                 "Accessibility in Vienna", "دسترسی‌پذیری در وین",
                 "The reference study: an accessibility ranking executed end to end.",
                 "مطالعه‌ی مرجع: رتبه‌بندی دسترسی‌پذیری که از ابتدا تا انتها اجرا می‌شود.", "", "", "smart-spatial-vienna-accessibility"),
                ("lake-urmia-shrinkage", "Lake Urmia", "دریاچه ارومیه", 37.6, 45.4, C.PROGRESS,
                 "Lake Urmia shrinkage", "کوچک‌شدن دریاچه ارومیه",
                 "Tracking the shrinkage of Lake Urmia from remote-sensing time series.",
                 "پایش کوچک‌شدن دریاچه ارومیه با سری‌های زمانی سنجش‌ازدور.", "", "", "smart-spatial-urmia-lake-shrinkage"),
                ("urmia-real-estate", "Urmia", "ارومیه", 37.5527, 45.0761, C.PROGRESS,
                 "Urmia real estate", "بازار مسکن ارومیه",
                 "Spatial analysis of the local real-estate market.",
                 "تحلیل مکانی بازار مسکن شهر.", "", "", "smart-spatial-urmia-real-estate"),
                ("tehran-tod", "Tehran", "تهران", 35.6892, 51.389, C.DRAFT,
                 "Tehran TOD gradient", "گرادیان TOD در تهران",
                 "Transit-oriented development gradient across Tehran — paper in draft.",
                 "گرادیان توسعه‌ی حمل‌ونقل‌محور در تهران — مقاله در حال نگارش.", "", "", ""),
            ]):
                CaseStudy.objects.create(slug=slug, city_en=city, city_fa=cfa, latitude=la, longitude=lo, status=st,
                                         title_en=ten, title_fa=tfa, summary_en=sen, summary_fa=sfa, result_en=ren,
                                         result_fa=rfa, repo_url=f"{GH}/{repo}" if repo else "", order=i)

        if not OpenSourceProject.objects.exists():
            for i, (n, d, dfa, lang, st, url, hl) in enumerate([
                ("GeoLibre (Persian localisation)", "Contributed Persian language support to the lightweight, cloud-native GIS platform for browser, desktop, mobile and Jupyter.", "افزودن پشتیبانی زبان فارسی به پلتفرم سبک و ابری GIS برای مرورگر، دسکتاپ، موبایل و Jupyter.", "TypeScript", 0, "https://github.com/opengeos/GeoLibre", True),
                ("smart_spatial_system", "s3geo — plugin-based GeoAI backend.", "s3geo — بک‌اند پلاگین‌محور GeoAI.", "Python", 2, f"{GH}/smart_spatial_system", True),
                ("geochat-platform", "Plugin-based GeoAI kernel and Python SDK.", "هسته‌ی پلاگین‌محور GeoAI و SDK پایتون.", "Python", 0, f"{GH}/geochat-platform", True),
                ("geo-araz", "Free Persian toolkit for maps and coordinates.", "جعبه‌ابزار رایگان فارسی برای نقشه و مختصات.", "JavaScript", 7, f"{GH}/geo-araz", True),
                ("rsynx", "Encrypted live terminal sharing.", "اشتراک زنده‌ی رمزنگاری‌شده‌ی ترمینال.", "TypeScript", 3, f"{GH}/rsynx", False),
                ("callyou-webrtc", "Self-hosted two-person WebRTC rooms with a collaborative whiteboard.", "اتاق‌های دونفره‌ی WebRTC خودمیزبان با تخته‌سفید مشارکتی.", "TypeScript", 3, f"{GH}/callyou-webrtc", False),
                ("bookane", "Open-source Persian tech-education platform.", "پلتفرم متن‌باز آموزش فناوری فارسی.", "Python", 0, f"{GH}/bookane", False),
                ("diskly", "Terminal disk-space analyzer with an optional AI cleanup advisor.", "تحلیل‌گر فضای دیسک در ترمینال با مشاور پاک‌سازی هوشمند اختیاری.", "TypeScript", 1, f"{GH}/diskly", False),
                ("geo-playground", "Small GIS and WebGIS demos: H3, WKT, routing, building footprints.", "نمونه‌های کوچک GIS و WebGIS: H3، WKT، مسیریابی، ردپای ساختمان.", "", 0, f"{GH}/geo-playground", False),
                ("gis-notes", "Notes and learning roadmaps for GIS development.", "یادداشت‌ها و نقشه‌ی راه یادگیری توسعه‌ی GIS.", "", 0, f"{GH}/gis-notes", False),
                ("Data-science-with-python", "Persian course materials for a Python data-science course.", "مواد درسی فارسی دوره‌ی علم داده با پایتون.", "Jupyter", 1, f"{GH}/Data-science-with-python", False),
                ("presentations", "Talks and presentations.", "سخنرانی‌ها و ارائه‌ها.", "HTML", 2, f"{GH}/presentations", False),
            ]):
                OpenSourceProject.objects.create(name=n, description_en=d, description_fa=dfa, language=lang, stars=st, url=url, highlight=hl, order=i)

        if not Service.objects.exists():
            for i, (ic, t, tfa, d, dfa) in enumerate([
                ("◎", "GeoAI & LLM systems", "سامانه‌های GeoAI و LLM", "Natural-language interfaces for spatial data: LLM planning with pre-execution validation, traceable outputs and reproducible results.", "رابط‌های زبان طبیعی برای داده‌ی مکانی: برنامه‌ریزی LLM با اعتبارسنجی پیش از اجرا، خروجی ردیابی‌پذیر و نتایج تکرارپذیر."),
                ("⌁", "MCP servers & agent tooling", "سرورهای MCP و ابزار عامل‌ها", "Model Context Protocol servers (Tools, Resources, Prompts) that let AI agents work safely with your GIS stack.", "سرورهای Model Context Protocol (ابزارها، منابع، پرامپت‌ها) که به عامل‌های هوش مصنوعی امکان کار ایمن با زیرساخت GIS شما را می‌دهند."),
                ("▦", "Geospatial backends & APIs", "بک‌اند و API مکانی", "Scalable Python/FastAPI/Django services over PostGIS, OGC standards (WMS, WFS, WCS, WMTS) and OpenAPI-documented REST.", "سرویس‌های مقیاس‌پذیر Python/FastAPI/Django روی PostGIS، استانداردهای OGC و REST مستندشده با OpenAPI."),
                ("◈", "PostGIS architecture & managed databases", "معماری PostGIS و پایگاه‌داده‌ی مدیریت‌شده", "Schema design, indexing, performance, backups — or a managed instance on postgis.ir.", "طراحی اسکیما، ایندکس‌گذاری، کارایی، بکاپ — یا یک نمونه‌ی مدیریت‌شده در postgis.ir."),
                ("⇄", "Spatial ETL & workflow automation", "ETL مکانی و خودکارسازی گردش‌کار", "Pipelines with Python, GDAL and SQL that turn hours of manual GIS work into repeatable jobs.", "پایپ‌لاین‌هایی با Python، GDAL و SQL که ساعت‌ها کار دستی GIS را به کارهای تکرارپذیر تبدیل می‌کنند."),
                ("✎", "Training & mentoring", "آموزش و منتورینگ", "Python for GIS, open-source GIS and backend engineering — for teams and individuals, in Persian or English.", "پایتون برای GIS، GIS متن‌باز و مهندسی بک‌اند — برای تیم‌ها و افراد، به فارسی یا انگلیسی."),
            ]):
                Service.objects.create(icon=ic, title_en=t, title_fa=tfa, description_en=d, description_fa=dfa, order=i)

        if not Experience.objects.exists():
            for i, (co, r, rfa, loc_, locfa, s, e, den, dfa) in enumerate([
                ("Spatial Science Innovators", "Geospatial Backend Developer", "توسعه‌دهنده‌ی بک‌اند مکانی", "Tehran, Iran", "تهران", "Nov 2025", "",
                 "Develop Python/FastAPI and PostGIS microservices for spatial processing\nBuild GeoAI pipelines integrating ML models with geospatial datasets\nDevelop MCP servers that expose GIS tools and resources to AI agents",
                 "توسعه‌ی میکروسرویس‌های Python/FastAPI و PostGIS برای پردازش مکانی\nساخت پایپ‌لاین‌های GeoAI و یکپارچه‌سازی مدل‌های یادگیری ماشین با داده‌ی مکانی\nتوسعه‌ی سرورهای MCP برای دسترسی عامل‌های هوش مصنوعی به ابزارهای GIS"),
                ("s3geo & postgis.ir", "Founder & Author", "بنیان‌گذار و نویسنده", "Remote", "دورکار", "2026", "",
                 "Author and sole maintainer of s3geo, an MIT-licensed GeoAI backend (1,800+ automated tests)\nFounded postgis.ir, a managed cloud PostGIS service with sub-minute provisioning",
                 "نویسنده و نگهدارنده‌ی تنهای s3geo، بک‌اند GeoAI با مجوز MIT (بیش از ۱٬۸۰۰ تست خودکار)\nبنیان‌گذار postgis.ir، سرویس ابری مدیریت‌شده‌ی PostGIS با ساخت پایگاه‌داده در کمتر از یک دقیقه"),
                ("Araz.me — Independent Consultancy", "GIS Developer & Geospatial Consultant", "توسعه‌دهنده‌ی GIS و مشاور مکانی", "Remote", "دورکار", "Jan 2018", "",
                 "Geospatial web applications (Django, Flask, JavaScript mapping libraries) and spatial ETL pipelines\nCustom QGIS plugins and GeoServer services; PostGIS architecture consulting\nPython for GIS training; promotion of FOSS4G tools in the regional community",
                 "اپلیکیشن‌های وب مکانی (Django، Flask، کتابخانه‌های نقشه‌ی جاوااسکریپت) و پایپ‌لاین‌های ETL مکانی\nافزونه‌های QGIS سفارشی و سرویس‌های GeoServer؛ مشاوره‌ی معماری PostGIS\nآموزش Python for GIS و ترویج ابزارهای FOSS4G در جامعه‌ی منطقه‌ای"),
                ("Alborz Insurance Company", "Senior Software Engineer", "مهندس ارشد نرم‌افزار", "Tehran, Iran", "تهران", "Aug 2016", "",
                 "Enterprise Python and C#/.NET services and REST APIs (Flask, Django) for insurance systems\nSpatial risk assessment, claims visualisation, data integration and anomaly-detection workflows\nSQL Server ETL, Linux deployments and Git-based CI/CD; leading and mentoring a technical team",
                 "سرویس‌ها و REST APIهای سازمانی با Python و C#/.NET (Flask، Django) برای سامانه‌های بیمه\nارزیابی ریسک مکانی، نمایش خسارت، یکپارچه‌سازی داده و تشخیص ناهنجاری\nETL روی SQL Server، استقرار روی Linux و CI/CD مبتنی بر Git؛ هدایت و منتورینگ تیم فنی"),
                ("PTA GIS Software Producer Company", "Python Engineer & Geospatial R&D Developer", "مهندس پایتون و توسعه‌دهنده‌ی R&D مکانی", "Tehran, Iran", "تهران", "2014", "2016",
                 "Researched and developed Sensor Web systems and OGC/SWE-based components\nData pipelines for GPS devices, weather stations and connected geospatial sensors",
                 "پژوهش و توسعه‌ی سامانه‌های Sensor Web و مؤلفه‌های مبتنی بر OGC/SWE\nپایپ‌لاین داده برای دستگاه‌های GPS، ایستگاه‌های هواشناسی و حسگرهای مکانی متصل"),
                ("Sadra Software Company", "Junior Software Developer", "توسعه‌دهنده‌ی نرم‌افزار", "Urmia, Iran", "ارومیه", "2010", "2012",
                 "Software development, database solutions and ETL processes with C and Microsoft SQL Server",
                 "توسعه‌ی نرم‌افزار، راه‌حل‌های پایگاه‌داده و فرایندهای ETL با C و Microsoft SQL Server"),
            ]):
                Experience.objects.create(company=co, role_en=r, role_fa=rfa, location_en=loc_, location_fa=locfa, start=s, end=e, summary_en=den, summary_fa=dfa, order=i)

        if not Education.objects.exists():
            Education.objects.create(school_en="Islamic Azad University, Science and Research Branch", school_fa="دانشگاه آزاد اسلامی، واحد علوم و تحقیقات", degree_en="M.Sc. in Geographic Information Systems (GIS)", degree_fa="کارشناسی ارشد سیستم‌های اطلاعات جغرافیایی (GIS)", years="2014 – 2015", order=0)
            Education.objects.create(school_en="Islamic Azad University, Mahabad", school_fa="دانشگاه آزاد اسلامی، واحد مهاباد", degree_en="B.Sc. in Computer Engineering", degree_fa="کارشناسی مهندسی کامپیوتر", years="2006 – 2010", order=1)

        if not Certification.objects.exists():
            for i, (t, tfa, n, nfa) in enumerate([
                ("Advanced Model Context Protocol (MCP)", "Model Context Protocol (MCP) پیشرفته", "MCP server development for geospatial AI", "توسعه‌ی سرور MCP برای هوش مکانی"),
                ("Introduction to Model Context Protocol", "آشنایی با Model Context Protocol", "AI–tool integration via MCP", "یکپارچه‌سازی هوش مصنوعی و ابزار با MCP"),
                ("Machine Learning with Python", "یادگیری ماشین با پایتون", "Applied ML for data analysis and prediction", "یادگیری ماشین کاربردی برای تحلیل و پیش‌بینی"),
                ("Geo Web App Building with Open Source Tools", "ساخت اپلیکیشن وب مکانی با ابزارهای متن‌باز", "Full-stack geospatial web development with FOSS4G", "توسعه‌ی وب مکانی فول‌استک با FOSS4G"),
                ("OSGeo Advocate", "مدافع OSGeo", "Promoting open-source geospatial software and standards", "ترویج نرم‌افزار و استانداردهای متن‌باز مکانی"),
            ]):
                Certification.objects.create(title_en=t, title_fa=tfa, note_en=n, note_fa=nfa, order=i)

        if not SkillGroup.objects.exists():
            for i, (n, nfa, s) in enumerate([
                ("GeoAI & MCP", "GeoAI و MCP", "LLM/DAG planning, Model Context Protocol, GeoAI, NLP for spatial queries, scikit-learn, TensorFlow"),
                ("Geospatial", "مکانی", "PostGIS, pgRouting, GDAL/OGR, GeoPandas, Shapely, Rasterio, Fiona, QGIS, GeoServer, remote sensing, OGC (WMS/WFS/WCS/WMTS)"),
                ("Backend", "بک‌اند", "Python, FastAPI, Django, Flask, C#/.NET, SQL, REST/OpenAPI"),
                ("Data", "داده", "PostgreSQL, MS SQL Server, SQLite/SpatiaLite, Redis, Pandas, NumPy, Jupyter"),
                ("Web", "وب", "JavaScript/TypeScript, React, Leaflet, OpenLayers"),
                ("Delivery", "استقرار", "Docker, Linux, Nginx, Git, GitHub Actions, pytest, CI/CD, PyPI"),
            ]):
                SkillGroup.objects.create(name_en=n, name_fa=nfa, skills=s, order=i)

        if not Post.objects.exists():
            Post.objects.create(slug="why-validate-llm-plans", date="2026-11-18", published=False,
                title_en="Why every LLM plan should be validated before it runs", title_fa="چرا هر برنامه‌ی LLM باید پیش از اجرا اعتبارسنجی شود",
                summary_en="Draft — notes on pre-execution validation for LLM-planned spatial workflows.", summary_fa="پیش‌نویس — یادداشت‌هایی درباره‌ی اعتبارسنجی پیش از اجرا در گردش‌کارهای مکانیِ برنامه‌ریزی‌شده با LLM.",
                body_en="Replace this draft in the admin panel.", body_fa="این پیش‌نویس را از پنل مدیریت جایگزین کنید.", tags="GeoAI, LLM, Reliability")

        self.stdout.write(self.style.SUCCESS("Content seeded."))
