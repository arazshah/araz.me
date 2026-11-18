from django.test import TestCase
from django.core.management import call_command
from core.models import Message


class SiteTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_content", verbosity=0)

    def test_pages(self):
        for lang in ("en", "fa"):
            for p in ("", "products/", "products/s3geo/", "case-studies/", "case-studies/istanbul-health-access/",
                      "open-source/", "services/", "about/", "resume/", "now/", "contact/"):
                self.assertEqual(self.client.get(f"/{lang}/{p}").status_code, 200, f"/{lang}/{p}")

    def test_persian_is_rtl(self):
        self.assertContains(self.client.get("/fa/"), 'dir="rtl"')

    def test_unpublished_post_hidden(self):
        self.assertEqual(self.client.get("/en/writing/why-validate-llm-plans/").status_code, 404)

    def test_contact_and_honeypot(self):
        self.client.post("/en/contact/", {"name": "A", "email": "a@b.co", "body": "hello"})
        self.client.post("/en/contact/", {"name": "Bot", "email": "b@b.co", "body": "x", "website": "spam"})
        self.assertEqual(Message.objects.count(), 1)

    def test_admin_moved(self):
        self.assertEqual(self.client.get("/admin/").status_code, 404)
        self.assertEqual(self.client.get("/panel/login/").status_code, 200)
