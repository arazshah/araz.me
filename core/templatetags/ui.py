from django import template
from django.utils import translation

from core.ui import UI

register = template.Library()


@register.simple_tag
def t(key):
    en, fa = UI[key]
    return fa if translation.get_language() == "fa" else en


@register.simple_tag
def status_label(status):
    key = f"st_{status}"
    return t(key) if key in UI else status


@register.simple_tag(takes_context=True)
def switch_url(context):
    """Same page, other language."""
    request = context["request"]
    cur = translation.get_language()
    other = "fa" if cur == "en" else "en"
    path = request.path
    if path.startswith(f"/{cur}/"):
        return f"/{other}/" + path[len(cur) + 2:]
    return f"/{other}/"
