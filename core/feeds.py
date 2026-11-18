from django.contrib.syndication.views import Feed
from django.utils import translation
from .models import Post


class PostFeed(Feed):
    title = "Araz Shahkarami — Writing"
    link = "/en/writing/"
    description = "Geospatial engineering, GeoAI and backend systems."

    def items(self):
        return Post.objects.filter(published=True)[:20]

    def item_title(self, item):
        return item.title_en or item.title_fa

    def item_description(self, item):
        return item.summary_en or item.summary_fa
