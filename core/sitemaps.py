from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import CaseStudy, Post, Product


class StaticSitemap(Sitemap):
    i18n = True
    priority = 0.8

    def items(self):
        return ["home", "products", "cases", "opensource", "services", "about", "resume", "contact", "now"]

    def location(self, item):
        return reverse(item)


class ProductSitemap(Sitemap):
    i18n = True
    priority = 0.7

    def items(self):
        return Product.objects.filter(published=True)


class CaseSitemap(ProductSitemap):
    def items(self):
        return CaseStudy.objects.filter(published=True)


class PostSitemap(ProductSitemap):
    def items(self):
        return Post.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.date
