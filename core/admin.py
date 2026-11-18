from django.contrib import admin
from .models import (CaseStudy, Certification, Education, Experience, Message, OpenSourceProject,
                     Post, Product, Service, SiteSettings, SkillGroup, Stat)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Identity", {"fields": [("name_en", "name_fa"), ("headline_en", "headline_fa"), "photo", "cv_pdf", "open_to_work"]}),
        ("Home hero", {"fields": ["tagline_en", "tagline_fa"]}),
        ("About page", {"fields": ["about_en", "about_fa"]}),
        ("/now page", {"fields": ["now_en", "now_fa"]}),
        ("Contact & links", {"fields": ["email", "linkedin", "github", "osgeo_url", ("location_en", "location_fa"), ("latitude", "longitude")]}),
        ("SEO", {"fields": ["meta_description_en", "meta_description_fa"]}),
    ]

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ["value", "label_en", "show_on_home", "order"]
    list_editable = ["show_on_home", "order"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "kind_en", "status", "featured", "published", "order"]
    list_editable = ["featured", "published", "order"]
    prepopulated_fields = {"slug": ("name",)}
    fieldsets = [
        (None, {"fields": ["name", "slug", ("kind_en", "kind_fa"), "status", "year", ("featured", "published", "order")]}),
        ("Content", {"fields": [("tagline_en", "tagline_fa"), "description_en", "description_fa", ("role_en", "role_fa"), "stack", "image"]}),
        ("Links", {"fields": ["url", "source_url", "package_url"]}),
    ]


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["title_en", "city_en", "status", "published", "order"]
    list_editable = ["published", "order"]
    prepopulated_fields = {"slug": ("title_en",)}


@admin.register(OpenSourceProject)
class OSAdmin(admin.ModelAdmin):
    list_display = ["name", "language", "stars", "highlight", "published", "order"]
    list_editable = ["highlight", "published", "order"]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title_en", "published", "order"]
    list_editable = ["published", "order"]


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["__str__", "date", "published"]
    list_editable = ["published"]
    search_fields = ["title_en", "title_fa", "body_en", "body_fa"]


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["role_en", "company", "start", "end", "order"]
    list_editable = ["order"]


admin.site.register(Education)
admin.site.register(Certification)
admin.site.register(SkillGroup)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "created", "is_read"]
    list_filter = ["is_read"]
    list_editable = ["is_read"]
    readonly_fields = ["name", "email", "subject", "body", "created"]

    def has_add_permission(self, request):
        return False
