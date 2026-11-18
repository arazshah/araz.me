from django.conf import settings
from django.utils import translation

from .models import Post, SiteSettings


def site(request):
    lang = translation.get_language() or "en"
    return {
        "S": SiteSettings.get(),
        "LANG": lang,
        "DIR": "rtl" if lang == "fa" else "ltr",
        "SITE_URL": settings.SITE_URL,
        "has_posts": Post.objects.filter(published=True).exists(),
    }
