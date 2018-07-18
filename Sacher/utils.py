# -*- coding: utf-8 -*-
import os
import re
import urllib

import numpy as np
from django.conf import settings
from django.template import Template, Context
from django.urls import reverse
from reportlab import platypus
from reportlab.graphics.shapes import Drawing, Line
from reportlab.lib import utils
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image

# estensioni di file
images_ext = ['jpg', 'jpeg', 'tiff', 'JPG', 'JPEG', 'TIFF', 'png', 'PNG']
docs_ext = ['doc', 'pdf', 'ppt', 'txt', 'rtf', 'xls', 'zip']


def sanitize_filename(name):
    name = name.replace(' ', '_')
    return name.lower()


def sizeof_fmt(num, suffix='B'):
    for unit in ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Y', suffix)


def local_path_from_media_path(media_path):
    media_p = media_path.replace('/', '\\')[1:]
    media_p = os.path.join(*(media_p.split('\\')[1:]))
    local_path = os.path.join(settings.MEDIA_ROOT, media_p)
    local_path = local_path.replace('\\', os.path.sep)
    return local_path


class RangeFileWrapper(object):
    def __init__(self, filelike, blksize=8192, offset=0, length=None):
        self.filelike = filelike
        self.filelike.seek(offset, os.SEEK_SET)
        self.remaining = length
        self.blksize = blksize

    def close(self):
        if hasattr(self.filelike, 'close'):
            self.filelike.close()

    def __iter__(self):
        return self

    def next(self):
        if self.remaining is None:
            # If remaining is None, we're reading the entire file.
            data = self.filelike.read(self.blksize)
            if data:
                return data
            raise StopIteration()
        else:
            if self.remaining <= 0:
                raise StopIteration()
            data = self.filelike.read(min(self.remaining, self.blksize))
            if not data:
                raise StopIteration()
            self.remaining -= len(data)
            return data


class Params3DHop:
    def __init__(self, op_pk=None, elemento_pk=None, year=None, with_spots=False, mod3d_id=None):
        from .models import Operazione, Elemento

        if op_pk is None and elemento_pk is None:
            raise Exception('Devi passare una pk per operazione o elemento.')

        self.with_spots = with_spots

        self.operazione = Operazione.objects.get(pk=op_pk) if op_pk is not None else None

        elem = self.operazione.elemento if op_pk is not None else Elemento.objects.get(pk=elemento_pk)
        self.elemento = elem
        self.operazioni = elem.operazione_set.all()
        self.modello3d = None
        self.children = None
        self.children_anni = None

        if year is not None:
            # Richiesta del modello3d tramite anno
            mod3d = elem.modello3d_set.filter(anno=year)
            if mod3d.exists():  # Entro se il QuerySet mod3d non è vuoto
                if mod3d.count() > 1:
                    self.modello3d = mod3d.get(pk=mod3d_id)
                else:
                    # Restituisco il primo modello recuperato di quell'anno
                    self.modello3d = mod3d[0]
                return
            else:
                # L'elemento non ha un modello3d, lo recupero tramite i figli, filtrando per anno
                elem_children = elem.get_all_children(include_self=False)
                if len(elem_children) == 0:
                    return
                self.children = [c.modello3d_set.filter(anno=year).first() for c in elem_children if len(c.modello3d_set.filter(anno=year)) > 0]
                years = elem_children[0].modello3d_set.all().values_list('anno', flat=True).distinct()
                for c in elem_children:
                    if c is not None:
                        years |= c.modello3d_set.all().values_list('anno', flat=True).distinct()
                years = sorted(list(years), reverse=True)
                years.remove(long(year))

                self.children_anni = years
        else:
            # Richiesta del modello3d, cerco il modello più recente
            years = elem.modello3d_set.all().values_list('anno', flat=True)
            if len(years) > 0:
                # l'elemento ha un modello3d
                max_year = max(years)
                self.modello3d = elem.modello3d_set.filter(anno=max_year)[0]
            else:
                # L'elemento non ha un modello3d, lo recupero tramite i figli
                elem_children = elem.get_all_children(include_self=False)
                if len(elem_children) == 0:
                    return
                else:
                    years = elem_children[0].modello3d_set.all().values_list('anno', flat=True).distinct()
                    for c in elem_children:
                        if c is not None:
                            years |= c.modello3d_set.all().values_list('anno', flat=True).distinct()
                    years = sorted(list(years), reverse=True)
                    # years = [c.modello3d_set.all().values_list('anno', flat=True) for c in elem_children]
                    if len(years) == 0:
                        return
                    max_year = max(years)
                    years.remove(long(max_year))
                    self.children_anni = years
                    # max_year = max([max(ly) for ly in years if ly.exists()])
                    self.children = [c.modello3d_set.filter(anno=max_year).first() for c in elem_children if len(c.modello3d_set.filter(anno=max_year)) > 0]
                    pass

    def get_year(self):
        if self.modello3d:
            return self.modello3d.anno
        elif self.children:
            return self.children[0].anno
        else:
            return '-'


def print_elemento(e):
    # return '<strong>' + e.nome + ':</strong> ' + e.descrizione + ' (<a href="' + reverse('sacher:elemento_detail',kwargs={'pk': e.pk}) + '">dettagli</a>)'
    str = '<strong>' + e.nome + ':</strong><a href="' + reverse('sacher:elemento_detail', kwargs={'pk': e.pk}) + '">' + e.descrizione + '</a>'
    return str


def print_elemento_advanced(e):
    # return '<strong>' + e.nome + ':</strong> ' + e.descrizione + ' (<a href="' + reverse('sacher:elemento_detail',kwargs={'pk': e.pk}) + '">dettagli</a>)'
    str = '<strong>' + e.nome + ':</strong><a href="' + reverse('sacher:elemento_detail', kwargs={'pk': e.pk}) + '">' + e.descrizione + '</a>'

    # Aggiungo le icone per modificare eliminare e informazioni
    str += '<button type="button" id="edit-element-' + unicode(e.pk) + '" class="edit-element">edit</button>'
    str += '<button type="button" id="delete-element-' + unicode(e.pk) + '" class="delete-element">delete</button>'
    # str += '<button type="button" class="info-element"></button>'
    return str


def explore_tree(root, r_html, f):
    from models import Elemento
    children = Elemento.objects.filter(padre=root)

    if len(children) > 0:
        r_html += '<ul>'
        for c in children:
            r_html += '<li>'
            r_html += f(c)
            r_html += explore_tree(c, '', f)
            r_html += '</li>'
        r_html += '</ul>'

    return r_html


def print_element_tree(bc_pk, perms):
    from models import Elemento
    roots = Elemento.objects.filter(padre=None, bene_culturale_id=bc_pk)
    res = ''

    f = print_elemento
    if perms >= 4:
        f = print_elemento_advanced
    for r in roots:
        r_html = '<ul><li>' + f(r)
        r_html += explore_tree(r, '', f)
        r_html += '</li></ul>'
        res += r_html

    return Template(res).render(Context({}))


def string_mat_mul(mat1, mat2):
    try:
        mat1 = np.fromstring(re.sub('[\[\]]', '', mat1), dtype=np.float64, sep=',')
        mat1 = mat1.reshape((4, 4))
        mat2 = np.fromstring(re.sub('[\[\]]', '', mat2), dtype=np.float64, sep=',')
        mat2 = mat2.reshape((4, 4))
        new_mat = np.matmul(mat1, mat2)
        return '[' + ','.join('%.16g' % v for v in np.nditer(new_mat)) + ']'
    except:
        return ''


def export_pdf(bc, operazione, images, files):
    def get_image(path, width=1 * cm):
        img = utils.ImageReader(path)
        iw, ih = img.getSize()
        aspect = ih / float(iw)
        return Image(path, width=width, height=(width * aspect))

    fname = "operazione" + str(operazione.id) + ".pdf"
    path = os.path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'export_files')
    if not os.path.exists(path):
        os.makedirs(path)
    doc = SimpleDocTemplate(os.path.join(path, fname), pagesize=A4, rightMargin=72, leftMargin=72, topMargin=18, bottomMargin=18)
    story = []
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))

    im = get_image(os.path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'imgs', 'sacher_project.png'), width=2 * inch)
    story.append(im)

    fields_to_skip = ['id', 'lat', 'lon']
    relationships_to_save = ['ambito', 'attivita', 'compilatore']

    name = '<font size=12><b>%s: </b></font>'
    text = '<font size=10>%s</font>'
    section = '<font size=14><b>%s</b></font>'

    # BC INFO
    story.append(Paragraph(section % unicode("Bene Culturale"), styles["Center"]))
    story.append(Spacer(1, 5))

    fields = list(bc._meta.get_fields())
    fields = [e for e in fields if e.name not in fields_to_skip]

    for i, f in enumerate(fields):
        if f.one_to_many or f.many_to_many or f.many_to_one or f.one_to_one:
            if f.name == 'categoria':
                categ_list = []
                categ = getattr(bc, f.name)
                while True:
                    if categ is None:
                        break
                    val = unicode(categ.nome).encode('utf-8')
                    tipo = unicode(categ.tipo).encode('utf-8').title()
                    categ_list.append(name % tipo + text % val)
                    categ = categ.sovracategoria
                for e in reversed(categ_list):
                    story.append(Paragraph(e, styles["Normal"]))
            continue
        val = unicode(getattr(bc, f.name)).encode('utf-8')
        if val == "None":
            continue
        s = name % f.name + text % val
        story.append(Paragraph(s, styles["Normal"]))
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 10))
    d = Drawing(100, 1)
    d.add(Line(50, 0, 450, 0))
    story.append(d)
    story.append(Spacer(1, 10))

    # OPERAZIONE INFO
    story.append(Paragraph(section % unicode("Operazione"), styles["Center"]))
    story.append(Spacer(1, 5))

    fields = list(operazione._meta.get_fields())
    fields = [e for e in fields if e.name not in fields_to_skip]
    for i, f in enumerate(fields):
        if f.one_to_many or f.many_to_many or f.many_to_one or f.one_to_one:
            if f.name not in relationships_to_save:
                continue

        val = unicode(getattr(operazione, f.name)).encode('utf-8')
        if val == "None":
            continue
        s = name % f.name + text % val
        story.append(Paragraph(s, styles["Normal"]))
        story.append(Spacer(1, 5))

    story.append(Paragraph(section % unicode("Immagini"), styles["Center"]))
    story.append(Spacer(1, 5))

    for x, i in enumerate(images):
        local_path_thumbnail = local_path_from_media_path(i.path_thumbnail).encode('utf-8').strip()
        local_path = local_path_from_media_path(i.path).encode('utf-8').strip()
        story.append(Image(local_path_thumbnail, 2 * inch, 2 * inch))
        _, tail = os.path.split(local_path_thumbnail)
        address = '<link href="' + urllib.quote(local_path, safe='/:') + '">' + tail + '</link>'
        story.append(Paragraph(address, styles["Center"]))

    story.append(Paragraph(section % unicode("File"), styles["Center"]))
    story.append(Spacer(1, 5))

    for f in files:
        local_path = local_path_from_media_path(f.path).encode('utf-8').strip()
        _, tail = os.path.split(local_path)
        address = '<link href="' + urllib.quote(local_path, safe='/:') + '">' + tail + '</link>'
        story.append(platypus.Paragraph(address, ParagraphStyle("Normal")))

    story.append(Spacer(1, 10))
    d = Drawing(100, 1)
    d.add(Line(50, 0, 450, 0))
    story.append(d)
    story.append(Spacer(1, 10))

    doc.build(story)
    return os.path.join(path, fname)


def crea_ambiti(bc):
    bc_id = bc.id
    ambiti_file_url = os.path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'files', 'ambiti.sql')
    import codecs
    ambiti_file = codecs.open(ambiti_file_url, encoding='ISO-8859-1', mode='r')
    text = ""
    i = 0
    for i, x in enumerate(ambiti_file):
        text += x
    file_lines = i
    latest_id = None

    query = "select auto_increment from information_schema.TABLES where TABLE_NAME ='Sacher_ambito' and TABLE_SCHEMA='sacher'"
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute(query)
        row = cursor.fetchone()
        latest_id = row[0]

    dict = {
        'bc_id': bc_id,
        'id_1': latest_id,
    }

    for i in range(2, file_lines + 1):
        latest_id += 1
        dict['id_' + str(i)] = latest_id

    with connection.cursor() as cursor:
        cursor.execute(text, dict)
