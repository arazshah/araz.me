import markdown
from django.utils.safestring import mark_safe


def render_md(text):
    """Render admin-authored Markdown (trusted content: only staff can edit it)."""
    if not text:
        return ""
    return mark_safe(markdown.markdown(text, extensions=["fenced_code", "tables", "sane_lists", "nl2br"]))
