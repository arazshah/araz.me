import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env(name, default=None):
    return os.environ.get(name, default)


DEBUG = env("DJANGO_DEBUG", "1") == "1"
SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-only-insecure-key-change-me" if DEBUG else None)
if not SECRET_KEY:
    raise RuntimeError("Set DJANGO_SECRET_KEY in production.")

# The site sits behind Coolify's proxy, so accept any Host by default (set DJANGO_ALLOWED_HOSTS to restrict).
# Local hosts are always allowed so container health checks never fail.
ALLOWED_HOSTS = [h.strip() for h in env("DJANGO_ALLOWED_HOSTS", "*").split(",") if h.strip()]
for _h in ("localhost", "127.0.0.1", "[::1]"):
    if "*" not in ALLOWED_HOSTS and _h not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(_h)
CSRF_TRUSTED_ORIGINS = [o.strip() for o in env(
    "DJANGO_CSRF_TRUSTED_ORIGINS", "https://araz.me,https://www.araz.me,http://araz.me,http://www.araz.me").split(",") if o.strip()]
SITE_URL = env("SITE_URL", "https://araz.me")

# Admin lives on a non-default path; change via ADMIN_URL.
ADMIN_URL = env("ADMIN_URL", "panel/").strip("/") + "/"

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
        "core.context.site",
    ]},
}]

DATABASES = {"default": {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": Path(env("SQLITE_PATH", str(BASE_DIR / "data" / "db.sqlite3"))),
    "OPTIONS": {"timeout": 20},
}}
DATABASES["default"]["NAME"].parent.mkdir(parents=True, exist_ok=True)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 10}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en"
LANGUAGES = [("en", "English"), ("fa", "فارسی")]
USE_I18N = True
USE_TZ = True
TIME_ZONE = "Asia/Tehran"

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
                    if not DEBUG else "django.contrib.staticfiles.storage.StaticFilesStorage"},
}
MEDIA_URL = "/media/"
MEDIA_ROOT = Path(env("MEDIA_ROOT", str(BASE_DIR / "media")))

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

JAZZMIN_SETTINGS = {
    "site_title": "Araz.me",
    "site_header": "Araz.me",
    "site_brand": "Araz.me",
    "welcome_sign": "Araz.me — content manager",
    "copyright": "Araz Shahkarami",
    "site_logo": None,
    "show_ui_builder": False,
    "topmenu_links": [
        {"name": "View site", "url": "/", "new_window": True},
    ],
    "order_with_respect_to": [
        "core.SiteSettings", "core.Stat", "core.Product", "core.CaseStudy",
        "core.OpenSourceProject", "core.Service", "core.Post",
        "core.Experience", "core.Education", "core.Certification",
        "core.SkillGroup", "core.Message",
    ],
    "icons": {
        "auth": "fas fa-users-cog", "auth.user": "fas fa-user", "auth.group": "fas fa-users",
        "core.SiteSettings": "fas fa-sliders-h", "core.Stat": "fas fa-chart-bar",
        "core.Product": "fas fa-cube", "core.CaseStudy": "fas fa-map-marked-alt",
        "core.OpenSourceProject": "fab fa-github", "core.Service": "fas fa-briefcase",
        "core.Post": "fas fa-pen-nib", "core.Experience": "fas fa-building",
        "core.Education": "fas fa-graduation-cap", "core.Certification": "fas fa-certificate",
        "core.SkillGroup": "fas fa-tools", "core.Message": "fas fa-envelope",
    },
}
JAZZMIN_UI_TWEAKS = {"theme": "flatly", "navbar_small_text": True, "default_theme_mode": "auto"}
