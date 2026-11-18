from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.shortcuts import redirect
from django.urls import path

from core import views
from core.feeds import PostFeed
from core.sitemaps import CaseSitemap, PostSitemap, ProductSitemap, StaticSitemap

handler404 = "core.views.not_found"

sitemaps = {"static": StaticSitemap, "products": ProductSitemap, "cases": CaseSitemap, "posts": PostSitemap}

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("robots.txt", views.robots),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
    path("feed.xml", PostFeed(), name="feed"),
    path("cv.pdf", views.cv_pdf, name="cv_pdf"),
]

urlpatterns += i18n_patterns(
    path("", views.home, name="home"),
    path("products/", views.products, name="products"),
    path("products/<slug:slug>/", views.product, name="product"),
    path("case-studies/", views.cases, name="cases"),
    path("case-studies/<slug:slug>/", views.case, name="case"),
    path("open-source/", views.opensource, name="opensource"),
    path("services/", views.services, name="services"),
    path("writing/", views.blog, name="blog"),
    path("writing/<str:slug>/", views.post, name="post"),
    path("about/", views.about, name="about"),
    path("resume/", views.resume, name="resume"),
    path("now/", views.now, name="now"),
    path("contact/", views.contact, name="contact"),
    prefix_default_language=True,
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    from django.views.static import serve
    from django.urls import re_path
    urlpatterns += [re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT})]
