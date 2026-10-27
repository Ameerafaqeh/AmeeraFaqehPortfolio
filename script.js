// ========================================
// 1. SELECTORS & GLOBAL VARIABLES
// ========================================

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let lang = localStorage.getItem('ameera-lang') === 'ar'
    ? 'ar'
    : 'en';

let content = {
    projects: [],
    certs: []
};


// ========================================
// 2. ESCAPE HTML
// ========================================

const esc = s =>
    String(s).replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])
    );


// ========================================
// 3. RENDER PROJECTS
// ========================================

function renderProjects() {
    const grid = $('#project-grid');

    grid.innerHTML = content.projects.map((p, i) => `
        <article
            class="project-card reveal visible"
            data-category="${esc(p.cat)}"
        >
            <div class="project-art">
                <span class="glyph" aria-hidden="true">
                    ${esc(p.glyph)}
                </span>

                <span class="art-tag">
                    ${esc(p.meta)}
                </span>
            </div>

            <div class="project-body">
                <span class="meta">
                    ${String(i + 1).padStart(2, '0')}
                    /
                    ${esc(p.cat.toUpperCase())}
                </span>

                <h3>${esc(p.name)}</h3>

                <p>${esc(p[lang])}</p>

                <div class="project-role">
                    ${esc(p.role)}
                </div>
            </div>
        </article>
    `).join('');

    applyFilter('project');
}


// ========================================
// 4. RENDER CERTIFICATES
// ========================================

function renderCerts() {
    const grid = $('#cert-grid');

    grid.innerHTML = content.certs.map((c, i) => `
        <article
            class="cert-card"
            data-category="${esc(c.cat)}"
        >
            <div class="certificate-photo">
                <img
                    src="${esc(c.image)}"
                    alt="${esc(c.name)}"
                    loading="lazy"
                    onload="this.parentElement.classList.add('has-image')"
                    onerror="this.remove()"
                >

                <div class="certificate-empty">
                    <span aria-hidden="true">▧</span>

                    <span>
                        ${lang === 'ar'
            ? 'أضيفي صورة الشهادة هنا'
            : 'Add certificate image here'
        }
                    </span>

                    <small>
                        ${esc(c.image.split('/').pop())}
                    </small>
                </div>
            </div>

            <div class="certificate-details">
                <span class="cert-index">
                    ${String(i + 1).padStart(2, '0')}
                    /
                    ${String(content.certs.length).padStart(2, '0')}
                </span>

                <h3>${esc(c.name)}</h3>

                <p>${esc(c.org)}</p>
            </div>
        </article>
    `).join('');

    applyFilter('cert');
}


// ========================================
// 5. FILTER PROJECTS & CERTIFICATES
// ========================================

function applyFilter(type) {
    const container = $('#' + type + '-filters');

    const target = type === 'project'
        ? '.project-card'
        : '.cert-card';

    const active = container.querySelector('.active');

    const filter = active?.dataset.filter || 'all';

    $$(target).forEach(el => {
        el.hidden =
            filter !== 'all' &&
            el.dataset.category !== filter;
    });
}


// ========================================
// 6. LANGUAGE SWITCHER
// ========================================

function setLanguage(value) {
    lang = value;

    document.documentElement.lang = lang;

    document.documentElement.dir =
        lang === 'ar' ? 'rtl' : 'ltr';

    document.body.dir =
        lang === 'ar' ? 'rtl' : 'ltr';

    $('#language').textContent =
        lang === 'en' ? 'عربي' : 'English';

    $$('[data-en][data-ar]').forEach(el => {
        el.innerHTML = el.dataset[lang];
    });

    localStorage.setItem('ameera-lang', lang);

    renderProjects();
    renderCerts();
}

$('#language').addEventListener('click', () => {
    setLanguage(lang === 'en' ? 'ar' : 'en');
});


// ========================================
// 7. MOBILE MENU
// ========================================

$('#menu').addEventListener('click', () => {
    const isOpen = $('#nav').classList.toggle('open');

    $('#menu').setAttribute(
        'aria-expanded',
        String(isOpen)
    );

    $('#menu').textContent = isOpen ? '✕' : '☰';
});

$$('.nav a').forEach(a => {
    a.addEventListener('click', () => {
        $('#nav').classList.remove('open');

        $('#menu').setAttribute(
            'aria-expanded',
            'false'
        );

        $('#menu').textContent = '☰';
    });
});


// ========================================
// 8. FILTER BUTTON EVENTS
// ========================================

for (const type of ['project', 'cert']) {
    $$('#' + type + '-filters button').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('#' + type + '-filters button').forEach(b => {
                b.classList.toggle('active', b === btn);
            });

            applyFilter(type);
        });
    });
}


// ========================================
// 9. SCROLL ANIMATIONS
// ========================================

const reduced = matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        }),
        {
            threshold: 0.08
        }
    );

    $$('.reveal').forEach(el => observer.observe(el));
} else {
    $$('.reveal').forEach(el => {
        el.classList.add('visible');
    });
}


// ========================================
// 10. SCROLL PROGRESS BAR
// ========================================

addEventListener('scroll', () => {
    const max =
        document.documentElement.scrollHeight - innerHeight;

    $('#progress').style.width =
        (max > 0 ? scrollY / max * 100 : 0) + '%';

}, {
    passive: true
});


// ========================================
// 11. CURRENT YEAR
// ========================================

$('#year').textContent = new Date().getFullYear();
// ========================================
// 12. PROJECTS & CERTIFICATES DATA
// ========================================

content = {
    projects: [
        {
            name: "Wasli | وصلي",
            meta: "Innovation · Prototype",
            role: "UI/UX · Front-End",
            en: "A community-powered parcel delivery concept connecting people sending items between Palestinian cities with travelers already making those journeys. Presented at Palestine X, the 10th National Forum for Creativity and Innovation.",
            ar: "منصة نموذجية لتوصيل الطرود بين المدن الفلسطينية عبر ربط المرسلين بأشخاص يسافرون بالفعل بين المدن. عُرضت في منتدى فلسطين X للإبداع والابتكار.",
            cat: "web",
            glyph: "📦"
        },
        {
            name: "AI4Purpose — Emergency Response",
            meta: "Hackathon · Prototype",
            role: "UI/UX · Research · Pitching",
            en: "Designed an emergency reporting concept allowing witnesses to report incidents, share their location and select relevant responders such as ambulance, police and fire services.",
            ar: "تصميم فكرة تطبيق للإبلاغ عن الحوادث والطوارئ ومشاركة الموقع وتحديد فرق الاستجابة المطلوبة كالإسعاف والشرطة والدفاع المدني.",
            cat: "ai",
            glyph: "🚨"
        },


        {
            name: "Skill AI Swap",
            meta: "Create Apps Championship · Dubai · 2025–2026",
            role: "Idea · Research · UI/UX · Pitching",
            en: "Skill AI Swap is an AI-assisted platform concept designed to connect people seeking job opportunities with individuals interested in learning and exchanging skills. Developed as part of the Create Apps Championship 2025–2026, organized by the Dubai Chamber of Digital Economy. Contributed to concept development, research, UI/UX design, and pitching.",
            ar: "Skill AI Swap هو مشروع منصة تعتمد على الذكاء الاصطناعي لربط الباحثين عن فرص العمل بالأشخاص المهتمين بتعلّم المهارات وتبادلها. طُوّرت الفكرة ضمن المشاركة في بطولة Create Apps Championship 2025–2026 التي تنظمها غرفة دبي للاقتصاد الرقمي. ساهمت في تطوير الفكرة والبحث وتصميم واجهات وتجربة المستخدم وعرض المشروع.",
            cat: "ai",
            glyph: "🧠"
        }

        ,
        {
            name: "Bank of Palestine — AI Sentiment Analysis",
            meta: "Intilaqa Palestine · Working Demo",
            role: "Front-End · UI/UX · Figma",
            en: "Built and presented a working customer-message sentiment analysis interface, identifying positive, negative, angry and satisfied responses. Developed the front-end and UI/UX for a hackathon project presented to judges.",
            ar: "تطوير واجهة وتجربة مستخدم لنظام عامل يحلل رسائل العملاء ويصنّف مشاعرهم إلى إيجابية وسلبية وغاضبة وراضية. عُرض المشروع أمام لجنة التحكيم.",
            cat: "ai",
            glyph: "🎭"
        },
        {
            name: "Smart Parking Counter",
            meta: "Arduino Day · 1st Place",
            role: "Arduino · Electronics · Sensors",
            en: "An Arduino-based parking counter that tracks entering cars and displays when the parking area reaches full capacity. Won first place among engineering students at Birzeit University.",
            ar: "نظام مواقف باستخدام أردوينو يحسب السيارات الداخلة ويعرض على الشاشة عند امتلاء الموقف. حاز المركز الأول في Arduino Day بجامعة بيرزيت.",
            cat: "robotics",
            glyph: "🅿️"

        },
        {
            name: "Airport Check-in System",
            meta: "Academic Project",
            role: "Java · JavaFX · Queues",
            en: "An airport check-in application built around queue data structures and a JavaFX interface.",
            ar: "تطبيق تسجيل ركاب المطار باستخدام هياكل بيانات الطوابير وواجهات JavaFX.",
            cat: "software",
            glyph: "🛫"
        },
        {
            name: "Library Management",
            meta: "Academic Project",
            role: "Java · JavaFX",
            en: "Desktop application for organizing and managing library records.",
            ar: "تطبيق سطح مكتب لإدارة وتنظيم سجلات المكتبة.",
            cat: "software",
            glyph: "📚"
        },
        {
            name: "Movie Catalog",
            meta: "Academic Project",
            role: "Hash Tables · AVL Trees",
            en: "A movie catalog using hash tables and AVL trees for data organization.",
            ar: "فهرس أفلام يعتمد على Hash Tables وأشجار AVL لتنظيم البيانات.",
            cat: "software",
            glyph: "🎬"
        },
        {
            name: "Student Admission",
            meta: "Academic Project",
            role: "Linked Lists · Java",
            en: "A student admissions project using linked data structures.",
            ar: "نظام قبول طلاب باستخدام القوائم المرتبطة في جافا.",
            cat: "software",
            glyph: "🎓"
        },
        {
            name: "Verilog ALU",
            meta: "Academic Project",
            role: "Verilog · Digital Logic",
            en: "Arithmetic logic unit designed in Verilog.",
            ar: "تصميم وحدة الحساب والمنطق باستخدام Verilog.",
            cat: "robotics",
            glyph: "🔌"
        },
        {
            name: "AI Dog Breed Classifier",
            meta: "Udacity AI Nanodegree · Deep Learning",
            role: "Python · PyTorch · CNN · AlexNet · VGG16 · ResNet18",
            en: "Developed a deep-learning image classifier to detect dogs and predict dog breeds using pretrained AlexNet, VGG16 and ResNet18 models. Processed images and compared classification accuracy and inference speed.",
            ar: "مشروع ضمن مسار الذكاء الاصطناعي في Udacity لتصنيف صور الكلاب وتوقّع سلالاتها باستخدام PyTorch وشبكات CNN ونماذج AlexNet وVGG16 وResNet18، مع معالجة الصور ومقارنة الدقة وسرعة التنفيذ.",
            cat: "ai",
            glyph: "🐕"
        },
        {
            name: "ORLA — Business Website",
            meta: "Personal Business Project",
            role: "HTML5 · CSS3 · JavaScript · Responsive Design · UI/UX",
            en: "Built a responsive business website for ORLA smartphone repair and technical services, presenting the brand, available services and contact information through a clear, accessible interface.",
            ar: "موقع تعريفي متجاوب لمشروع ORLA لصيانة الهواتف والخدمات التقنية، يعرض هوية المشروع والخدمات وطرق التواصل مع التركيز على تجربة مستخدم واضحة على الهاتف والكمبيوتر.",
            cat: "web",
            glyph: "📱"
        },
        {
            name: "Business Landing Page",
            meta: "Web Development Project",
            role: "HTML5 · CSS3 · Responsive Design · UI/UX",
            en: "Designed a responsive business landing page with custom navigation and an interactive data-entry form, focusing on content hierarchy, usability and layout across screen sizes.",
            ar: "صفحة تعريفية للأعمال باستخدام HTML وCSS تضم واجهة رئيسية وقائمة تنقل ونموذج إدخال بيانات، مع الاهتمام بالتجاوب وتنظيم المحتوى وتجربة المستخدم.",
            cat: "web",
            glyph: "🌐"
        },
        {
            name: "Image Processing API",
            meta: "Udacity Full Stack JavaScript Nanodegree · Back-End",
            role: "Node.js · TypeScript · REST API · Image Resizing · Caching",
            en: "Built an image-processing REST API using Node.js and TypeScript to resize images on request. Implemented caching of previously processed images to reduce repeated processing and improve response times.",
            ar: "واجهة REST API لمعالجة الصور وتغيير أبعادها باستخدام Node.js وTypeScript، مع التخزين المؤقت للصور المعالجة لتقليل تكرار العمليات وتحسين سرعة الاستجابة.",
            cat: "software",
            glyph: "🖼️"
        },
        {
            name: "Web Developer Portfolio",
            meta: "Udacity Front End Nanodegree · Web",
            role: "HTML5 · CSS3 · SCSS/Less · BEM · Accessibility",
            en: "Created a responsive developer portfolio with a personal introduction and interactive project gallery, using BEM-based CSS organization and considering accessibility and usability.",
            ar: "موقع أعمال شخصي ضمن مسار Front End في Udacity، يضم نبذة شخصية ومعرض مشاريع تفاعلي، ويطبّق التصميم المتجاوب ومنهجية BEM واعتبارات سهولة الوصول.",
            cat: "web",
            glyph: "💻"
        },
        {
            name: "Library Management System — SQL",
            meta: "Database Course · Academic Project",
            role: "Java · SQL · OOP · Database Management",
            en: "Developed a school library management system to organize books and manage student, teacher and staff records, including book borrowing and returns, using Java, SQL and object-oriented design.",
            ar: "نظام لإدارة مكتبة مدرسية باستخدام Java وSQL لتنظيم الكتب وبيانات الطلاب والمعلمين والموظفين ومتابعة الاستعارة والإرجاع وتطبيق مبادئ OOP.",
            cat: "software",
            glyph: "📚"
        },
        {
            name: "Hotel Reservation Management System",
            meta: "Java Course · Academic Project",
            role: "Java · OOP · Data Structures · File Handling",
            en: "Developed a hotel reservation system in three stages, covering room bookings, room-type changes, cancellations and reservation details, then added text-file persistence for reservation data.",
            ar: "نظام حجوزات فنادق بلغة Java تم تطويره عبر ثلاث مراحل، ويشمل الحجز وتغيير نوع الغرفة والإلغاء وعرض التفاصيل، مع حفظ بيانات الحجوزات وتحديثها في ملفات نصية.",
            cat: "software",
            glyph: "🏨"
        },
        {
            name: "Bags E-Commerce Store",
            meta: "Full-Stack Web Application",
            role: "HTML5 · CSS3 · JavaScript · Database · CRUD",
            en: "Built a full-stack bags e-commerce application with product listings, a shopping cart, quantity updates and automatic totals, plus an admin dashboard to create, edit and delete products.",
            ar: "متجر إلكتروني متكامل للحقائب يتيح عرض المنتجات والأسعار وسلة المشتريات وتعديل الكميات وحساب الإجمالي، مع لوحة تحكم لإضافة المنتجات وتعديلها وحذفها وربطها بقاعدة بيانات.",
            cat: "web",
            glyph: "👜"
        }
    ],

    // ========================================
    // 13. CERTIFICATES
    // ========================================

    certs: [
        {
            name: "Front End Web Developer Nanodegree",
            org: "Udacity",
            cat: "development",
            image: "assets/certificates/certificate-01.jpg"
        },
        {
            name: "Full Stack JavaScript Developer Nanodegree",
            org: "Udacity",
            cat: "development",
            image: "assets/certificates/certificate-02.jpg"
        },
        {
            name: "AI Programming with Python & TensorFlow Nanodegree",
            org: "Udacity",
            cat: "ai",
            image: "assets/certificates/certificate-03.jpg"
        },
        {
            name: "Smartphone Maintenance & Programming — 96% (2026)",
            org: "Knowledge Lights Center · Palestinian Ministry of Labor certified",
            cat: "technical",
            image: "assets/certificates/certificate-04.jpg"
        },
        {
            name: "Machine Learning & AI Using Python",
            org: "The Hope International Company",
            cat: "ai",
            image: "assets/certificates/certificate-05.jpg"
        },
        {
            name: "JavaScript Bootcamp",
            org: "Gaza Sky Geeks",
            cat: "development",
            image: "assets/certificates/certificate-06.jpg"
        },
        {
            name: "UI/UX Design",
            org: "The Hope",
            cat: "design",
            image: "assets/certificates/certificate-07.jpg"
        },
        {
            name: "Git & GitHub",
            org: "Microsoft Learn Student Ambassador",
            cat: "development",
            image: "assets/certificates/certificate-08.jpg"
        },
        {
            name: "Linux System Bootcamp",
            org: "Training program",
            cat: "technical",
            image: "assets/certificates/certificate-09.jpg"
        },
        {
            name: "BIM Sessions",
            org: "IMechE — BZU",
            cat: "technical",
            image: "assets/certificates/certificate-10.jpg"
        },
        {
            name: "Cyber Security",
            org: "OHSC",
            cat: "security",
            image: "assets/certificates/certificate-11.jpg"
        },
        {
            name: "Microsoft Azure AI Fundamentals — AI Overview",
            org: "Microsoft",
            cat: "ai",
            image: "assets/certificates/certificate-12.jpg"
        },
        {
            name: "AI & Data Science Bootcamp",
            org: "Training program",
            cat: "ai",
            image: "assets/certificates/certificate-13.jpg"
        },
        {
            name: "Digital Marketing",
            org: "Training program",
            cat: "business",
            image: "assets/certificates/certificate-14.jpg"
        },
        {
            name: "Mastering Business Plans",
            org: "HIT.MENA",
            cat: "business",
            image: "assets/certificates/certificate-15.jpg"
        },
        {
            name: "Tech Circles Mentorship",
            org: "Palestine Techno Park",
            cat: "business",
            image: "assets/certificates/certificate-16.jpg"
        },
        {
            name: "C++ Bootcamp",
            org: "IEEE Computer Society",
            cat: "development",
            image: "assets/certificates/certificate-17.jpg"
        },
        {
            name: "Power BI",
            org: "Makan",
            cat: "ai",
            image: "assets/certificates/certificate-18.jpg"
        },
        {
            name: "Database Security with Oracle — 50 Hours",
            org: "Gaza Sky Geeks",
            cat: "security",
            image: "assets/certificates/certificate-19.jpg"
        },
        {
            name: "Flutter Track",
            org: "Google Developer Group",
            cat: "development",
            image: "assets/certificates/certificate-20.jpg"
        }
        ,
        {
            name: "Arduino ",
            org: "Usdemy",
            cat: "robotics",
            image: "assets/certificates/certificate-21.jpg"
        }
        ,

        {
            name: "1st Place — Arduino Day Competition",
            org: "IEEE & Arduino Day — Birzeit University",
            cat: "technical",
            image: "assets/certificates/certificate-22.jpg"
        },

        {
            name: "2nd Place — WRO Palestine ",
            org: "World Robot Olympiad Palestine — Future Engineers",
            cat: "technical",
            image: "assets/certificates/certificate-23.jpg"
        },

        {
            name: "Create Apps Championship Certificate of Participation",
            org: "Dubai Chamber of Digital Economy — Create Apps in Dubai",
            cat: "development",
            image: "assets/certificates/certificate-24.jpg"
        },

        {
            name: "AI4Purpose Hackathon Certificate of Participation",
            org: "Birzeit University — EU-funded MEDIAGENCY Project",
            cat: "ai",
            image: "assets/certificates/certificate-25.jpg"
        }
        ,
        {
            name: "WRO Palestine 2026 — Volunteer Appreciation Certificate",
            org: "World Robot Olympiad Palestine — Birzeit University",
            cat: "technical",
            image: "assets/certificates/certificate-26.jpg"
        }


        ,




    ]
};


// ========================================
// 14. INITIALIZE WEBSITE
// ========================================

setLanguage(lang);
