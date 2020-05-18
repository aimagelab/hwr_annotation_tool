import os, sys
from django.conf import settings
sys.path.append('/home/rgasparini/Documents/ailab_hwr')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ailb_web.settings")
import django
import textract # serve installare antiword

django.setup()

from hwr.models import *
from path import Path

media_root = Path(settings.MEDIA_ROOT)

base_dir = Path("opere")

opere = (media_root / base_dir).dirs()

for op_dir in opere:
    images = sorted(op_dir.files("*.JPG"))

    with open(op_dir / "titolo.txt") as f:
        autore = f.readline().strip()
        opera = f.readline().strip()

    scheda = ""
    if Path(op_dir / "scheda.doc").exists():
        scheda = textract.process(Path(op_dir / "scheda.doc").__str__()).decode()

    a = Autore(nome=autore)
    a.save()
    o = Opera(nome=opera, autore=a, scheda=scheda)
    o.save()
    for nr, pg in enumerate(images):
        p_path = (base_dir.name / op_dir.name / pg.name).__str__()
        Pagina(opera=o, photo=p_path, pagina_nr=nr+1).save()
