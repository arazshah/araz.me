# araz.me

Personal site of Araz Shahkarami — Django 5 + SQLite, bilingual (English / فارسی, RTL), with an admin panel.

## Run locally
```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_content      # initial content (idempotent)
python manage.py create_admin      # user: admin, password: Araz@Change-Me-2026
python manage.py runserver
```
Admin: http://localhost:8000/panel/ — **change the password right after the first login**
(top-right menu → Change password). Everything on the site is editable there.

## Production (Docker / Coolify)
Set the variables from `.env.example` (at least `DJANGO_SECRET_KEY`), mount a volume at `/data`
(SQLite database + uploaded media) and expose port 8000.

## Tests
```bash
python manage.py test
```
