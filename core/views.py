from django.contrib import messages
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods

from .models import (CaseStudy, Certification, Education, Experience, Message, OpenSourceProject,
                     Post, Product, Service, SiteSettings, SkillGroup, Stat)


def home(request):
    ctx = {
        "stats": Stat.objects.filter(show_on_home=True),
        "featured": Product.objects.filter(published=True, featured=True)[:4],
        "cases": CaseStudy.objects.filter(published=True)[:6],
        "all_cases": CaseStudy.objects.filter(published=True),
        "posts": Post.objects.filter(published=True)[:3],
        "services": Service.objects.filter(published=True)[:4],
        "experience": Experience.objects.all()[:4],
    }
    return render(request, "core/home.html", ctx)


def products(request):
    return render(request, "core/products.html", {"products": Product.objects.filter(published=True)})


def product(request, slug):
    p = get_object_or_404(Product, slug=slug, published=True)
    others = Product.objects.filter(published=True).exclude(pk=p.pk)[:3]
    return render(request, "core/product.html", {"p": p, "others": others})


def cases(request):
    return render(request, "core/cases.html", {"cases": CaseStudy.objects.filter(published=True)})


def case(request, slug):
    c = get_object_or_404(CaseStudy, slug=slug, published=True)
    others = CaseStudy.objects.filter(published=True).exclude(pk=c.pk)[:3]
    return render(request, "core/case.html", {"c": c, "others": others})


def opensource(request):
    qs = OpenSourceProject.objects.filter(published=True)
    return render(request, "core/opensource.html", {"highlights": qs.filter(highlight=True), "repos": qs.filter(highlight=False)})


def services(request):
    return render(request, "core/services.html", {"services": Service.objects.filter(published=True)})


def blog(request):
    page = Paginator(Post.objects.filter(published=True), 9).get_page(request.GET.get("page"))
    return render(request, "core/blog.html", {"page": page})


def post(request, slug):
    p = get_object_or_404(Post, slug=slug, published=True)
    return render(request, "core/post.html", {"p": p})


def about(request):
    return render(request, "core/about.html", {"skills": SkillGroup.objects.all(), "experience": Experience.objects.all()})


def resume(request):
    return render(request, "core/resume.html", {
        "experience": Experience.objects.all(), "education": Education.objects.all(),
        "certs": Certification.objects.all(), "skills": SkillGroup.objects.all(),
        "products": Product.objects.filter(published=True, featured=True)[:3],
    })


def now(request):
    return render(request, "core/now.html")


@require_http_methods(["GET", "POST"])
def contact(request):
    if request.method == "POST":
        if request.POST.get("website"):  # honeypot
            return redirect("contact")
        name = request.POST.get("name", "").strip()[:120]
        email = request.POST.get("email", "").strip()[:254]
        body = request.POST.get("body", "").strip()[:5000]
        if name and email and "@" in email and body:
            Message.objects.create(name=name, email=email, subject=request.POST.get("subject", "").strip()[:200], body=body)
            messages.success(request, "sent")
            return redirect(reverse("contact") + "?sent=1")
    return render(request, "core/contact.html", {"sent": request.GET.get("sent")})


def robots(request):
    from django.conf import settings
    txt = f"User-agent: *\nAllow: /\nDisallow: /{settings.ADMIN_URL}\nSitemap: {settings.SITE_URL}/sitemap.xml\n"
    return HttpResponse(txt, content_type="text/plain")


def cv_pdf(request):
    s = SiteSettings.get()
    if s.cv_pdf:
        return redirect(s.cv_pdf.url)
    return redirect("resume")


def not_found(request, exception=None):
    return render(request, "404.html", status=404)
