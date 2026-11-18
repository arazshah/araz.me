from django.db import models
from django.urls import reverse
from django.utils import timezone, translation
from django.utils.text import slugify

from .markup import render_md


def loc(name):
    """Property returning <name>_fa when the active language is Persian
    (falling back to English when the Persian value is empty)."""
    def getter(self):
        en = getattr(self, f"{name}_en", "")
        if translation.get_language() == "fa":
            return getattr(self, f"{name}_fa", "") or en
        return en or getattr(self, f"{name}_fa", "")
    return property(getter)


def loc_md(name):
    def getter(self):
        en = getattr(self, f"{name}_en", "")
        txt = (getattr(self, f"{name}_fa", "") or en) if translation.get_language() == "fa" else en
        return render_md(txt)
    return property(getter)


class SiteSettings(models.Model):
    """Single row holding the global content of the site."""
    name_en = models.CharField("Name (EN)", max_length=100, default="Araz Shahkarami")
    name_fa = models.CharField("Name (FA)", max_length=100, blank=True, default="آراز شاه‌کرمی")
    headline_en = models.CharField("Headline (EN)", max_length=200)
    headline_fa = models.CharField("Headline (FA)", max_length=200, blank=True)
    tagline_en = models.TextField("Hero text (EN)")
    tagline_fa = models.TextField("Hero text (FA)", blank=True)
    about_en = models.TextField("About (EN, Markdown)")
    about_fa = models.TextField("About (FA, Markdown)", blank=True)
    now_en = models.TextField("/now page (EN, Markdown)", blank=True)
    now_fa = models.TextField("/now page (FA, Markdown)", blank=True)
    location_en = models.CharField(max_length=100, default="Urmia, Iran")
    location_fa = models.CharField(max_length=100, blank=True, default="ارومیه، ایران")
    latitude = models.FloatField(default=37.5527)
    longitude = models.FloatField(default=45.0761)
    email = models.EmailField(default="mail@araz.me")
    linkedin = models.URLField(default="https://www.linkedin.com/in/araz-shahkarami/")
    github = models.URLField(default="https://github.com/arazshah")
    osgeo_url = models.URLField("OSGeo wiki", blank=True)
    photo = models.ImageField(upload_to="site/", blank=True, help_text="Leave empty to use the built-in photo.")
    cv_pdf = models.FileField("CV (PDF)", upload_to="cv/", blank=True)
    open_to_work = models.BooleanField("Show 'available' badge", default=True)
    meta_description_en = models.CharField(max_length=300, blank=True)
    meta_description_fa = models.CharField(max_length=300, blank=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"

    def save(self, *a, **kw):
        self.pk = 1
        super().save(*a, **kw)

    @classmethod
    def get(cls):
        return cls.objects.first() or cls(headline_en="Geospatial AI Engineer", tagline_en="", about_en="")

    name = loc("name")
    headline = loc("headline")
    tagline = loc("tagline")
    location = loc("location")
    meta_description = loc("meta_description")
    about = loc_md("about")
    now = loc_md("now")


class Stat(models.Model):
    value = models.CharField(max_length=20, help_text="e.g. 100, 1,800+, 20×")
    label_en = models.CharField(max_length=80)
    label_fa = models.CharField(max_length=80, blank=True)
    show_on_home = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.value} {self.label_en}"

    label = loc("label")


class Product(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        BETA = "beta", "Beta"
        ARCHIVED = "archived", "Archived"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    kind_en = models.CharField("Category (EN)", max_length=80)
    kind_fa = models.CharField("Category (FA)", max_length=80, blank=True)
    tagline_en = models.CharField(max_length=250)
    tagline_fa = models.CharField(max_length=250, blank=True)
    description_en = models.TextField("Description (EN, Markdown)")
    description_fa = models.TextField("Description (FA, Markdown)", blank=True)
    role_en = models.CharField("My role (EN)", max_length=120, blank=True)
    role_fa = models.CharField("My role (FA)", max_length=120, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    year = models.CharField(max_length=20, blank=True, help_text="e.g. 2026 – Present")
    stack = models.CharField(max_length=300, blank=True, help_text="Comma-separated")
    url = models.URLField("Live site", blank=True)
    source_url = models.URLField("Source code", blank=True)
    package_url = models.URLField("Package (PyPI…)", blank=True)
    image = models.ImageField(upload_to="products/", blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("product", args=[self.slug])

    kind = loc("kind")
    tagline = loc("tagline")
    role = loc("role")
    description = loc_md("description")

    @property
    def stack_list(self):
        return [s.strip() for s in self.stack.split(",") if s.strip()]


class CaseStudy(models.Model):
    class Status(models.TextChoices):
        COMPLETE = "complete", "Complete"
        PROGRESS = "progress", "In progress"
        DRAFT = "draft", "Paper draft"
        REFERENCE = "reference", "Reference study"

    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=160)
    title_fa = models.CharField(max_length=160, blank=True)
    city_en = models.CharField(max_length=60)
    city_fa = models.CharField(max_length=60, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    summary_en = models.TextField()
    summary_fa = models.TextField(blank=True)
    body_en = models.TextField("Body (EN, Markdown)", blank=True)
    body_fa = models.TextField("Body (FA, Markdown)", blank=True)
    result_en = models.CharField("Headline result (EN)", max_length=160, blank=True)
    result_fa = models.CharField("Headline result (FA)", max_length=160, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.COMPLETE)
    repo_url = models.URLField(blank=True)
    image = models.ImageField(upload_to="cases/", blank=True)
    published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name_plural = "case studies"

    def __str__(self):
        return self.title_en

    def get_absolute_url(self):
        return reverse("case", args=[self.slug])

    title = loc("title")
    city = loc("city")
    summary = loc("summary")
    result = loc("result")
    body = loc_md("body")


class OpenSourceProject(models.Model):
    name = models.CharField(max_length=100)
    description_en = models.CharField(max_length=300)
    description_fa = models.CharField(max_length=300, blank=True)
    language = models.CharField(max_length=40, blank=True)
    stars = models.PositiveIntegerField(default=0)
    url = models.URLField()
    highlight = models.BooleanField(default=False, help_text="Show in the highlighted row")
    published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "open-source project"

    def __str__(self):
        return self.name

    description = loc("description")


class Service(models.Model):
    title_en = models.CharField(max_length=120)
    title_fa = models.CharField(max_length=120, blank=True)
    description_en = models.TextField()
    description_fa = models.TextField(blank=True)
    icon = models.CharField(max_length=4, default="◆", help_text="A short glyph/emoji")
    order = models.PositiveSmallIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_en

    title = loc("title")
    description = loc("description")


class Post(models.Model):
    slug = models.SlugField(unique=True, allow_unicode=True, blank=True)
    title_en = models.CharField(max_length=200, blank=True)
    title_fa = models.CharField(max_length=200, blank=True)
    summary_en = models.CharField(max_length=300, blank=True)
    summary_fa = models.CharField(max_length=300, blank=True)
    body_en = models.TextField("Body (EN, Markdown)", blank=True)
    body_fa = models.TextField("Body (FA, Markdown)", blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated")
    cover = models.ImageField(upload_to="posts/", blank=True)
    published = models.BooleanField(default=False)
    date = models.DateField(default=timezone.localdate)

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return self.title_en or self.title_fa

    def save(self, *a, **kw):
        if not self.slug:
            self.slug = slugify(self.title_en or self.title_fa, allow_unicode=True)
        super().save(*a, **kw)

    def get_absolute_url(self):
        return reverse("post", args=[self.slug])

    title = loc("title")
    summary = loc("summary")
    body = loc_md("body")

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]

    @property
    def reading_minutes(self):
        txt = self.body_fa if translation.get_language() == "fa" and self.body_fa else self.body_en
        return max(1, round(len(txt.split()) / 200))


class Experience(models.Model):
    company = models.CharField(max_length=120)
    role_en = models.CharField(max_length=120)
    role_fa = models.CharField(max_length=120, blank=True)
    location_en = models.CharField(max_length=80, blank=True)
    location_fa = models.CharField(max_length=80, blank=True)
    start = models.CharField(max_length=20, help_text="e.g. 2025 or Nov 2025")
    end = models.CharField(max_length=20, blank=True, help_text="Leave empty for 'Present'")
    summary_en = models.TextField("Summary (EN)", help_text="One bullet per line")
    summary_fa = models.TextField("Summary (FA)", blank=True, help_text="One bullet per line")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.role_en} @ {self.company}"

    role = loc("role")
    location = loc("location")
    summary = loc("summary")

    @property
    def bullets(self):
        return [l.strip(" -•") for l in self.summary.splitlines() if l.strip()]


class Education(models.Model):
    school_en = models.CharField(max_length=160)
    school_fa = models.CharField(max_length=160, blank=True)
    degree_en = models.CharField(max_length=160)
    degree_fa = models.CharField(max_length=160, blank=True)
    years = models.CharField(max_length=30)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.degree_en

    school = loc("school")
    degree = loc("degree")


class Certification(models.Model):
    title_en = models.CharField(max_length=160)
    title_fa = models.CharField(max_length=160, blank=True)
    note_en = models.CharField(max_length=250, blank=True)
    note_fa = models.CharField(max_length=250, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_en

    title = loc("title")
    note = loc("note")


class SkillGroup(models.Model):
    name_en = models.CharField(max_length=80)
    name_fa = models.CharField(max_length=80, blank=True)
    skills = models.CharField(max_length=500, help_text="Comma-separated")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name_en

    name = loc("name")

    @property
    def skill_list(self):
        return [s.strip() for s in self.skills.split(",") if s.strip()]


class Message(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return f"{self.name} — {self.subject or self.body[:40]}"
