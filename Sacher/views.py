# -*- coding: utf-8 -*-
from __future__ import division

import ast
import cStringIO
import io
import json
import subprocess
import urllib2
from os import path, stat

import PIL
import exifread
from PIL import Image
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.core.validators import validate_email
from django.db.models import Q
from django.http import HttpResponseRedirect, Http404, StreamingHttpResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.views import generic
from django_ajax.decorators import ajax
from rest_framework.renderers import JSONRenderer
from swift import storage
from django.forms.models import model_to_dict

from forms import *
from serializers import Ref3dSerializer, ElementoSerializer
from utils import *

# Gestione accessi mediante decoratore
# def group_allowed(groups, login_url=None):
#     def test_func(user):
#         if user.is_staff or user.groups.filter(name__in=groups).exists():
#             return True
#         else:
#             return False
#
#     actual_decorator = user_passes_test(test_func, login_url=login_url)
#     return actual_decorator


# # Gestione accessi mediante funzione
# def group_allowed_function(request, groups):
#     if not request.user.is_staff and not request.user.groups.filter(name__in=groups).exists():
#         if request.META.get('HTTP_REFERER'):
#             return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
#         else:
#             return HttpResponseRedirect('sacher:home')
#     else:
#         return None


# def check_group(request, groups):
#     if request.user.is_staff or request.user.groups.filter(name__in=groups).exists():
#         # L'utente ha permessi
#         return True
#     else:
#         # L'utente non ha permessi
#         return False


ente = (['ente'], 5)
# gestione
mananger = (['project_manager', 'ente'], 4)
# inserimento
insert = (['operator', 'project_manager', 'ente'], 3)
# consultazione avanzata
consult_m2 = (['member_2', 'operator', 'project_manager', 'ente'], 2)
consult_m1 = (['member_1', 'member_2', 'operator', 'project_manager', 'ente'], 1)
# consultazione
# consult = ['member_1', 'member_2', 'operator', 'project_manager', 'ente']

# groups = [consult_m1, consult_m2, insert, mananger, ente]
groups = [ente, mananger, insert, consult_m2, consult_m1]


# Dato l'utente corrente e il BC, restituisco il permesso dell'utente corrente in numero
def get_perm(request, bc_id):
    if request.user.groups.filter(name__in=ente[0]).exists():
        return ente[1]
    ruolo = None
    try:
        ruolo = UtenteBC.objects.get(bene_culturale_id=bc_id, utente_id=request.user.id).ruolo
    except UtenteBC.DoesNotExist:
        # L'utente corrente non ha nessun permesso in questo BC
        return None
    group = [r[1] for r in [g for g in groups] if ruolo.name in r[0]][0]
    return group


ambiti = ['Campagna fotografica', 'Analisi delle finestre', 'Analisi del laterizio', 'Documentazione Storica', 'Documentazione Multimediale', 'Diagnostica', 'Cantiere']
ambiti_colore = ['Arancione', 'Azzurro', 'Rosso', 'Giallo', 'Rosa', 'Verde', 'Blu']
attivita = ['Manutenzione', 'Identificazione', 'Intervento', 'Progetto', 'Analisi']

ss = storage.SwiftStorage()


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class IndexView(generic.TemplateView):
    template_name = 'Sacher/index.html'


class BeneCulturaleList(generic.ListView):
    model = BeneCulturale
    context_object_name = 'bbcc_list'
    ordering = ['nome']

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(BeneCulturaleList, self).get_context_data(**kwargs)

        # Aggiungo le macrocategorie, mentre le def tiplogiche e qulificazioni verranno caricate con richieste ajax
        macro = Categoria.objects.filter(tipo=Categoria.TIPO_CHOICES[0][0])
        context['macrocategorie'] = macro

        # Aggiungo tutte le immagini collegate ai BBCC
        context['bc_imgs'] = Immagine.objects.all()

        bbcc = BeneCulturale.objects.all()
        mod3d_exists = {}
        for bc in bbcc:
            mod3d_exists[bc.id] = Modello3d.objects.filter(elemento__bene_culturale_id=bc.id).exists()
        context['mod3d_exists'] = mod3d_exists
        # context['sacher_perms'] = get_perm(self.request, bcpk)

        context['epoche'] = list(zip(*BeneCulturale.DATAZIONE_CHOICES)[0])
        context['MAPS_API_KEY'] = settings.MAPS_API_KEY
        return context


class BeneCulturaleDetail(generic.DetailView):
    model = BeneCulturale
    context_object_name = 'bc'
    raise_exception = False
    login_url = 'sacher:bc_list'
    redirect_field_name = None

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(BeneCulturaleDetail, self).get_context_data(**kwargs)
        # Add in a QuerySet of all the elements and operations
        bcpk = context['bc'].pk

        # Aggiungo tutte le immagini collegate al BC
        context['bc_imgs'] = Immagine.objects.filter(bc_id=bcpk)

        sacher_perms = get_perm(self.request, bcpk)
        context['sacher_perms'] = sacher_perms

        # context['elementi_list'] = Elemento.objects.filter(bene_culturale=bcpk)
        context['elementi_tree'] = print_element_tree(bc_pk=bcpk, perms=sacher_perms)
        ops = Operazione.objects.filter(elemento__bene_culturale_id=bcpk)
        context['operazioni_list'] = ops

        # Aggiungo le macrocategorie, mentre le def tiplogiche e qulificazioni verranno caricate con richieste ajax
        macro = Categoria.objects.filter(tipo=Categoria.TIPO_CHOICES[0][0])
        context['macrocategorie'] = macro

        # Allego per tutte le operazioni, i files TODO da prelevare con richieste ajax
        files = File.objects.filter(operazione__elemento__bene_culturale_id=bcpk)
        q = Q()
        for ext in images_ext:
            q |= Q(path__endswith=ext)

        notq = Q()
        for ext in images_ext:
            notq &= ~Q(path__endswith=ext)

        images = files.filter(q)
        files = files.filter(notq)
        context['images'] = images
        context['files'] = files
        # images = files.filter(path__regex=r"'" + '|'.join(images_ext) + "'")
        # context['images'] = images
        # files = files.filter(path__regex=r"'" + '|'.join(docs_ext) + "'")
        # context['files'] = files
        context['base_url'] = str(settings.SWIFT_OBJECT_STORAGE_URL)

        ops_json = []
        for o in ops:
            o_dict = model_to_dict(o)
            o_dict['desc'] = o_dict['descrizione']
            o_dict['ambito_id'] = o.ambito.id
            o_dict['attivita_id'] = o.attivita.id
            o_dict['ambito'] = o.ambito.nome
            o_dict['attivita'] = o.attivita.nome
            o_dict['elemento'] = o.elemento.nome
            images_json = []
            for i in images.filter(operazione=o):
                x = []
                x.append(context['base_url']+i.path_thumbnail)
                x.append(context['base_url']+i.path)
                images_json.append(x)
            o_dict['images'] = images_json
            files_json = []
            for i in files.filter(operazione=o):
                x = []
                x.append(context['base_url'] + i.path)
                x.append(reverse('sacher:get_file_icon', kwargs={'file_pk': int(i.id)}))
                x.append(i.filename())
                files_json.append(x)
            o_dict['ref3d_id'] = list(Ref3D.objects.filter(operazione=o).values_list('id', flat=True))
            o_dict['files'] = files_json

            ops_json.append(json.dumps(o_dict, indent=4, sort_keys=True, default=str))

        context['ops_json'] = ops_json

        context['elementi'] = Elemento.objects.filter(bene_culturale_id=bcpk).order_by('nome')
        context['ambiti'] = Ambito.objects.filter(progetto=bcpk, padre=None)

        if Elemento.objects.filter(padre=None, bene_culturale_id=bcpk).exists():
            root = Elemento.objects.filter(padre=None, bene_culturale_id=bcpk)[0]
            params = Params3DHop(with_spots=True, elemento_pk=root.id)
            context['params3dhop'] = params
            context['elemento'] = root
            context['curr_anno'] = params.get_year()

        return context


# def beneculturale_detail(request, pk, anno=None):
#     context = {}
#     bc = BeneCulturale.objects.get(pk=pk)
#     context['bc'] = bc
#     bcpk = bc.id
#
#     # Aggiungo tutte le immagini collegate al BC
#     context['bc_imgs'] = Immagine.objects.filter(bc_id=bcpk)
#
#     sacher_perms = get_perm(request, bcpk)
#     context['sacher_perms'] = sacher_perms
#
#     # context['elementi_list'] = Elemento.objects.filter(bene_culturale=bcpk)
#     context['elementi_tree'] = print_element_tree(bc_pk=bcpk)
#     context['operazioni_list'] = Operazione.objects.filter(elemento__bene_culturale_id=bcpk)
#
#     # Aggiungo le macrocategorie, mentre le def tiplogiche e qulificazioni verranno caricate con richieste ajax
#     macro = Categoria.objects.filter(tipo=Categoria.TIPO_CHOICES[0][0])
#     context['macrocategorie'] = macro
#
#     # Allego per tutte le operazioni, i files TODO da prelevare con richieste ajax
#     files = File.objects.filter(operazione__elemento__bene_culturale_id=bcpk)
#     q = Q()
#     for ext in images_ext:
#         q |= Q(path__endswith=ext)
#
#     notq = Q()
#     for ext in images_ext:
#         notq &= ~Q(path__endswith=ext)
#
#     context['files'] = files.filter(notq)
#     context['images'] = files.filter(q)
#     context['base_url'] = str(settings.SWIFT_OBJECT_STORAGE_URL)
#
#     if Elemento.objects.filter(padre=None, bene_culturale_id=bcpk).exists():
#         root = Elemento.objects.filter(padre=None, bene_culturale_id=bcpk)[0]
#         params = Params3DHop(with_spots=True, elemento_pk=root.id)
#         context['params3dhop'] = params
#         context['elemento'] = root
#         context['curr_anno'] = params.get_year()
#         # from swift import storage
#         # ss = storage.SwiftStorage()
#         # path = os.path.join(*(params.modello3d.path.split('/')[2:]))
#         # path = ss.url(path)
#         # context['mod_url'] = path
#
#     return render(request, 'Sacher/beneculturale_detail.html', context)


class BeneCulturaleUpdate(LoginRequiredMixin, generic.UpdateView):
    model = BeneCulturale
    fields = '__all__'
    context_object_name = 'bc'


class BeneCulturaleDelete(LoginRequiredMixin, generic.DeleteView):
    model = BeneCulturale
    context_object_name = 'bc'
    success_url = reverse_lazy('sacher:bc_list')


@login_required
@ajax
def bc_delete(request):
    if request.POST.get('bc_id') is None:
        return Http404
    pk = request.POST.get('bc_id')

    bc = BeneCulturale.objects.get(pk=pk)

    bc.delete()

    return HttpResponseRedirect(reverse('sacher:bc_list'))


class BeneCulturaleCreate(LoginRequiredMixin, generic.CreateView):
    model = BeneCulturale
    context_object_name = 'bc'
    fields = '__all__'


@login_required
def elemento_detail(request, pk, anno=None, mod3d_id=None):
    elem = Elemento.objects.get(pk=pk)
    bc_id = elem.bene_culturale_id
    # bc = BeneCulturale.objects.get(pk=bc_id)

    sacher_perms = get_perm(request, bc_id)

    operazioni = None
    if request.user.id:
        operazioni = Operazione.objects.filter(elemento_id=pk)

    params = Params3DHop(with_spots=True, elemento_pk=pk, year=anno, mod3d_id=mod3d_id)
    curr_anno = params.get_year()
    elementi_tree = print_element_tree(bc_pk=bc_id, perms=sacher_perms)

    # Allego per tutte le operazioni, i files TODO da prelevare con richieste ajax
    files = File.objects.filter(operazione__elemento__bene_culturale_id=bc_id)
    q = Q()
    for ext in images_ext:
        q |= Q(path__endswith=ext)

    notq = Q()
    for ext in images_ext:
        notq &= ~Q(path__endswith=ext)

    elementi = Elemento.objects.filter(bene_culturale_id=bc_id).order_by('nome')

    elemento_gerarchia = []
    curr_elem = elem
    while curr_elem.padre is not None:
        elemento_gerarchia.insert(0, curr_elem)
        curr_elem = curr_elem.padre

    return render(request, 'Sacher/elemento_detail.html',
                  {'elemento': elem, 'operazioni_list': operazioni, 'params3dhop': params, 'curr_anno': curr_anno,
                   'elementi_tree': elementi_tree, 'sacher_perms': sacher_perms, 'files': files.filter(notq), 'images': files.filter(q),
                   'base_url': str(settings.SWIFT_OBJECT_STORAGE_URL), 'elementi': elementi, 'elemento_gerarchia': elemento_gerarchia})


class ElementoUpdate(LoginRequiredMixin, generic.UpdateView):
    model = Elemento
    fields = '__all__'
    context_object_name = 'elemento'


@login_required
@ajax
def delete_elemento(request):
    """Cancella un elemento e assegna ai suoi figli come padre il padre dell'elemento da eliminare"""
    if request.POST.get('elem_id') is None:
        return Http404
    pk = request.POST.get('elem_id')

    el = Elemento.objects.get(pk=pk)

    if request.method == 'POST':
        children = el.get_direct_children()
        for c in children:
            c.padre = el.padre
            c.save()

        bcpk = el.bene_culturale_id
        el.delete()

        return HttpResponseRedirect(reverse('sacher:bc_detail', kwargs={'pk': bcpk}))
    else:
        return render(request, 'Sacher/elemento_confirm_delete.html', {'elemento': el})


class ElementoCreate(LoginRequiredMixin, generic.CreateView):
    model = Elemento
    fields = '__all__'


@login_required
def operazione_detail(request, pk, anno=None):
    operazione = Operazione.objects.get(pk=pk)

    files = File.objects.filter(operazione=operazione.id)

    q = Q()
    for ext in images_ext:
        q |= Q(path__endswith=ext)

    notq = Q()
    for ext in images_ext:
        notq &= ~Q(path__endswith=ext)

    params = Params3DHop(op_pk=operazione.id, with_spots=True, year=anno)

    context = dict()
    context['operazione'] = operazione
    context['files'] = files.filter(notq)
    context['images'] = files.filter(q)
    context['params3dhop'] = params
    context['curr_anno'] = params.get_year()
    context['base_url'] = str(settings.SWIFT_OBJECT_STORAGE_URL)

    return render(request, 'Sacher/operazione_detail.html', context)


@login_required()
def operazione_update(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret
    op = Operazione.objects.get(pk=pk)
    bc = BeneCulturale.objects.get(pk=op.elemento.bene_culturale_id)

    if request.method == 'POST':
        form = UpdateOperazioneForm(bc.id, op.id, request.POST)
        if form.is_valid():
            form.update_on_db()
            return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': pk}))
    else:
        form = UpdateOperazioneForm(bc.id, op.id)

    return render(request, 'Sacher/operazione_form.html', {'form': form, 'op': op})


class OperazioneDelete(LoginRequiredMixin, generic.DeleteView):
    model = Operazione
    context_object_name = 'operazione'

    # success_url = reverse_lazy('sacher:bc_detail', kwargs={'pk':})

    def get_success_url(self):
        bcid = self.object.elemento.bene_culturale.id
        return reverse_lazy('sacher:bc_detail', kwargs={'pk': bcid})

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_staff or self.request.user.groups.filter(name__in=insert).exists():
            return super(OperazioneDelete, self).dispatch(request, *args, **kwargs)
        else:
            return HttpResponseRedirect(self.request.META.get('HTTP_REFERER'))


class OperazioneCreate(LoginRequiredMixin, generic.CreateView):
    model = Operazione
    context_object_name = 'operazione'
    fields = '__all__'

    # def dispatch(self, request, *args, **kwargs):
    #     if self.request.user.is_staff or self.request.user.groups.filter(name__in=insert).exists():
    #         return super(OperazioneCreate, self).dispatch(request, *args, **kwargs)
    #     else:
    #         return HttpResponseRedirect(self.request.META.get('HTTP_REFERER'))


@login_required
def bc_add_elemento(request, pk):
    bc = BeneCulturale.objects.get(pk=pk)

    if request.method == 'POST':
        form = AddElementoToBcForm(pk, request.POST, request.FILES)
        if form.is_valid():
            new_el = form.save(pk)

            return HttpResponseRedirect(reverse('sacher:elemento_detail', kwargs={'pk': new_el.pk}))
    else:
        form = AddElementoToBcForm(pk)

    return render(request, 'Sacher/beneculturale_add_elemento.html', {'form': form, 'bc': bc})


@login_required
@ajax
def add_element(request):
    if request.method == 'POST':
        data = request.POST
        bc_id = int(data.get('bc_id'))
        if bc_id is None:
            return HttpResponse(status=400)
        el = Elemento()
        try:
            el.bene_culturale_id = bc_id
            el.nome = data.get('nome')

            if data.get('descrizione') != '':
                el.descrizione = data.get('descrizione')
            else:
                el.descrizione = ''

            if data.get('padre') != '':
                el.padre_id = int(data.get('padre'))
            else:
                el.padre = None
            el.save()
            return HttpResponse(content="Salvato", status=200)

        except PermissionDenied:
            error = "Forbidden (Permission denied): Can't add extra information to operation"
            print error
            return HttpResponse(content=error, status=403)
        except Exception, e:
            print str(e)
            return HttpResponse(content=str(e), status=500)
    else:
        return HttpResponse(status=403)


@login_required
def bc_add_operazione(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    bc = BeneCulturale.objects.get(pk=pk)

    if request.method == 'POST':
        form = AddOperazioneForm(pk, request.POST)
        if form.is_valid():
            form.save_from_bc_page(pk, request.user.id)
            return HttpResponseRedirect(reverse('sacher:bc_detail', kwargs={'pk': pk}))
    else:
        form = AddOperazioneForm(pk)

    return render(request, 'Sacher/add_op.html', {'form': form, 'bc': bc})


@login_required()
def elemento_add_operazione(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    elemento = Elemento.objects.get(pk=pk)
    bc_pk = elemento.bene_culturale.id

    if request.method == 'POST':
        form = AddOperazioneForm(elemento.bene_culturale_id, request.POST)
        if form.is_valid():
            form.save_from_bc_page(pk, request.user.id)
            return HttpResponseRedirect(reverse('sacher:bc_detail', kwargs={'pk': bc_pk}))
    else:
        form = AddOperazioneForm(elemento.bene_culturale_id)

    return render(request, 'Sacher/add_op.html', {'form': form, 'elemento': elemento})


@login_required()
def op_add_file(request, pk):
    operazione = Operazione.objects.get(pk=pk)

    if request.method == 'POST':
        form = AddFileToOperazioneForm(request.POST, request.FILES)

        if request.FILES:
            files = request.FILES.getlist('files')

            for f in files:
                sane_bc_nome = sanitize_filename(operazione.elemento.bene_culturale.nome)
                # il path generico è: sacher_files/palazzo_del_podesta/8/, 8 è la pk dell'operazione
                ss = storage.SwiftStorage()
                name = path.join('sacher_files', sane_bc_nome, pk, f.name)
                name = ss.save(name, f)

                file_url = path.join(settings.MEDIA_URL, name)
                file_url = file_url.replace('\\', '/')

                dbfile = File()
                dbfile.path = file_url
                dbfile.operazione_id = operazione.id
                dbfile.save()

            return HttpResponseRedirect(reverse('sacher:operazione_add_file', kwargs={'pk': pk}))

        # files = request.FILES.getlist('files')
        # if form.is_valid():
        #     for f in files:
        #         sane_bc_nome = sanitize_filename(operazione.elemento.bene_culturale.nome)
        #         # il path generico è: sacher_files/palazzo_del_podesta/8/, 8 è la pk dell'operazione
        #         fdir = path.join(settings.MEDIA_ROOT, 'sacher_files', sane_bc_nome, pk)
        #
        #         if not path.exists(fdir):
        #             os.makedirs(fdir)
        #
        #         fpath = path.join(fdir, f.name)
        #
        #         # chunks itera sul file con chunk di 64K (default). Evita di caricare tutti il file in memoria
        #         with open(fpath, 'wb+') as destination:
        #             for chunk in f.chunks():
        #                 destination.write(chunk)
        #
        #         file_url = path.join(settings.MEDIA_URL, 'sacher_files', sane_bc_nome, pk, f.name)
        #         file_url = file_url.replace('\\', '/')
        #
        #         dbfile = File()
        #         dbfile.path = file_url
        #         dbfile.operazione_id = operazione.id
        #         dbfile.save()
    else:
        form = AddFileToOperazioneForm()

    return render(request, 'Sacher/add_file.html', {'form': form, 'operazione': operazione})


@login_required()
def op_add_op_collegata(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    op = Operazione.objects.get(pk=pk)

    if request.method == 'POST':
        form = AddOpCollegataForm(pk, request.POST)
        if form.is_valid():
            form.save(op.id)

            return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': op.id}))
    else:
        form = AddOpCollegataForm(op.id)

    return render(request, 'Sacher/add_op_collegata.html', {'form': form})


@login_required()
def op_remove_op_collegata(request, pk, pk_to_remove):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    op = Operazione.objects.get(pk=pk)
    op_coll = Operazione.objects.get(pk=pk_to_remove)

    op.altre_op.remove(op_coll)
    op.save()

    return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': pk}))


@login_required()
def file_detail(request, pk):
    f_obj = File.objects.get(pk=pk)
    local_path = local_path_from_media_path(f_obj.path).encode('utf-8')

    # find previous and next files
    prev_file = None
    next_file = None
    other_files = File.objects.filter(operazione=f_obj.operazione)
    for i in range(0, len(other_files)):
        if other_files[i] == f_obj:
            prev_file = other_files[i - 1] if i - 1 >= 0 else None
            next_file = other_files[i + 1] if i + 1 < len(other_files) else None
            break

    try:
        file_size = sizeof_fmt(stat(local_path).st_size)
    except:
        file_size = 'error determining the file size'

    exif_data = {}
    is_image = False
    for ext in images_ext:
        if local_path.endswith(ext):
            is_image = True
            file = cStringIO.StringIO(urllib2.urlopen(local_path).read())
            tags = exifread.process_file(file)
            interesting_tags = {
                'EXIF ApertureValue': 'Aperture Value',
                'Image Make': 'Camera Manufacturer',
                'Image Model': 'Camera Model',
                'Image DateTime': 'Date',
                'Image XResolution': 'Horizonatal Resolution',
                'Image YResolution': 'Vertical Resolution',
                'EXIF ColorSpace': 'Color Space',
                'EXIF ExifImageLength': 'Image Height',
                'EXIF ExifImageWidth': 'Image Width',
                'EXIF ExposureTime': 'Exposure Time',
                'EXIF ISOSpeedRatings': 'ISO'
            }
            for k, v in interesting_tags.items():
                if k in tags:
                    exif_data[v] = tags[k]
            # with open(local_path, 'r') as f:
            #     tags = exifread.process_file(f)
            #     interesting_tags = {
            #         'EXIF ApertureValue': 'Aperture Value',
            #         'Image Make': 'Camera Manufacturer',
            #         'Image Model': 'Camera Model',
            #         'Image DateTime': 'Date',
            #         'Image XResolution': 'Horizonatal Resolution',
            #         'Image YResolution': 'Vertical Resolution',
            #         'EXIF ColorSpace': 'Color Space',
            #         'EXIF ExifImageLength': 'Image Height',
            #         'EXIF ExifImageWidth': 'Image Width',
            #         'EXIF ExposureTime': 'Exposure Time',
            #         'EXIF ISOSpeedRatings': 'ISO'
            #     }
            #
            #     for k, v in interesting_tags.items():
            #         if k in tags:
            #             exif_data[v] = tags[k]
            break

    return render(request, 'Sacher/file_detail.html',
                  {'file': f_obj, 'filesize': file_size, 'exif': exif_data, 'is_image': is_image, 'prev_file': prev_file, 'next_file': next_file, 'base_url': str(settings.SWIFT_OBJECT_STORAGE_URL)})


@login_required
def file_delete(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    f = File.objects.get(pk=pk)
    op_id = f.operazione.id
    local_path = local_path_from_media_path(f.path)
    if os.path.isfile(local_path):
        os.remove(local_path)
    f.delete()

    return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': op_id}))


range_re = re.compile(r'bytes\s*=\s*(\d+)\s*-\s*(\d*)', re.I)


@login_required()
def file_edit(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    f = File.objects.get(pk=pk)

    if request.method == 'POST':
        form = EditFileForm(request.POST)
        if form.is_valid():
            form.save(pk)
            return HttpResponseRedirect(reverse('sacher:file_detail', kwargs={'pk': pk}))
    else:
        if f.url is not None or f.descrizione is not None:
            form = EditFileWithDataForm(pk)
        else:
            form = EditFileForm()
        return render(request, 'Sacher/file_edit.html', {'file': f, 'form': form})


@login_required()
def file_edit_remove_url(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    f = File.objects.get(pk=pk)
    f.url = None
    f.save()

    return HttpResponseRedirect(reverse('sacher:file_detail', kwargs={'pk': pk}))


def range_download(request, modello3d_pk, filename=None):
    try:
        modello = Modello3d.objects.get(pk=modello3d_pk)
    except ObjectDoesNotExist:
        return HttpResponse(status=500)

    if modello.path == '' or modello.path is None:
        raise Http404

    url = os.path.join(*(modello.path.split('/')[2:]))
    fname = ss.url(url)
    req = urllib2.Request(fname)
    size = urllib2.urlopen(fname).info()['Content-Length']
    content_type = urllib2.urlopen(fname).info()['Content-Type']
    content_type = content_type or 'application/octet-stream'

    range_header = request.META.get('HTTP_RANGE', '').strip()
    range_match = range_re.match(range_header)

    if range_match:
        first_byte, last_byte = range_match.groups()
        first_byte = int(first_byte) if first_byte else 0
        last_byte = int(last_byte) if last_byte else size - 1
        if last_byte >= size:
            last_byte = size - 1
        length = last_byte - first_byte + 1

        req.add_header('Range', 'bytes=' + str(first_byte) + '-' + str(last_byte))
        resp = urllib2.urlopen(req)
        resp = StreamingHttpResponse(resp, status=206, content_type=content_type)
        resp['Content-Length'] = str(length)
        resp['Content-Range'] = 'bytes %s-%s/%s' % (first_byte, last_byte, size)
    else:
        resp = urllib2.urlopen(req)
        resp = StreamingHttpResponse(resp, content_type=content_type)
        resp['Content-Length'] = str(size)
    resp['Accept-Ranges'] = 'bytes'
    return resp


@login_required()
def get_file_icon(request, file_pk):
    f = File.objects.get(pk=file_pk)

    fname = (settings.SWIFT_OBJECT_STORAGE_URL + f.path).encode('utf-8')
    f_ext = fname[-3:]
    if f_ext in docs_ext:
        icon_fname = path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'icons', f_ext) + '.png'
        infile = open(icon_fname, 'rb')
        img_bytes = infile.read()
        cont_type = 'image/png'
    else:
        icon_fname = path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'icons', 'default') + '.png'
        infile = open(icon_fname, 'rb')
        img_bytes = infile.read()
        cont_type = 'image/png'

    response = HttpResponse(img_bytes, content_type=cont_type)
    response['Content-Disposition'] = u'attachment; filename={0}'.format(path.basename(fname))
    response['Content-Length'] = len(img_bytes)
    return response


@login_required()
def thumbnailer(request, file_pk):
    f = File.objects.get(pk=file_pk)

    fname = (settings.SWIFT_OBJECT_STORAGE_URL + f.path).encode('utf-8')

    f_ext = fname[-3:]
    if f_ext in docs_ext:
        icon_fname = path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'icons', f_ext) + '.png'
        infile = open(icon_fname, 'rb')
        img_bytes = infile.read()
        cont_type = 'image/png'

    elif f_ext in images_ext:
        fname = (settings.SWIFT_OBJECT_STORAGE_URL + f.path_thumbnail).encode('utf-8')
        fname = urllib.quote(fname, safe='/:')
        file = cStringIO.StringIO(urllib2.urlopen(fname).read())

        # pil_img = Image.open(file)
        # pil_img.thumbnail((200, 200))
        # pil_img = pil_img.convert('RGB')
        #
        # pil_img_b = io.BytesIO()
        # pil_img.save(pil_img_b, format='JPEG')
        # img_bytes = pil_img_b.getvalue()

        img_bytes = file.getvalue()
        cont_type = 'image/' + f_ext

    else:
        icon_fname = path.join(settings.STATIC_ROOT, settings.STATIC_URL[1:], 'sacher', 'icons', 'default') + '.png'
        infile = open(icon_fname, 'rb')
        img_bytes = infile.read()
        cont_type = 'image/png'

    response = HttpResponse(img_bytes, content_type=cont_type)
    response['Content-Disposition'] = u'attachment; filename={0}'.format(path.basename(fname))
    response['Content-Length'] = len(img_bytes)
    return response


@login_required()
def elemento_add_model(request, pk):
    el = Elemento.objects.get(pk=pk)

    if request.method == 'POST':
        form = AddModelToElementoForm(request.POST, request.FILES)
        if form.is_valid():
            sane_bc_nome = sanitize_filename(el.bene_culturale.nome)

            f = request.FILES['nxs_file']
            ss = storage.SwiftStorage()
            name = path.join('sacher_files', sane_bc_nome, f.name)
            name = ss.save(name, f)

            file_url = path.join(settings.MEDIA_URL, name)
            file_url = file_url.replace('\\', '/')

            mod3d = Modello3d()
            mod3d.path = file_url
            mod3d.elemento = el
            mod3d.nome = form.cleaned_data['nome']
            mod3d.anno = form.cleaned_data['anno']
            mod3d.vista_iniziale = None
            mod3d.save()

            return HttpResponseRedirect(reverse('sacher:elemento_detail', kwargs={'pk': pk}))
    else:
        form = AddModelToElementoForm()

    return render(request, 'Sacher/add_modello.html', {'form': form, 'elemento': el})


@login_required()
def delete_model(request, pk):
    mod3d = Modello3d.objects.get(pk=pk)
    el_pk = mod3d.elemento_id

    # Cancello il file del modello 3D
    ss = storage.SwiftStorage()
    path = os.path.join(*(mod3d.path.split('/')[2:]))
    # ss.delete(path)
    mod3d.delete()
    return HttpResponseRedirect(reverse('sacher:elemento_detail', kwargs={'pk': el_pk}))


@login_required()
def update_3d_refs(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    # pk: pk dell'operazione a cui sono legati
    operazione = Operazione.objects.get(pk=pk)
    params = Params3DHop(op_pk=pk, with_spots=True)

    return render(request, 'Sacher/operazione_edit_spot.html', {'operazione': operazione, 'params3dhop': params})


@login_required()
def op_add_collegamento_esterno(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    if request.method == 'POST':
        form = AddCollegamentoEsternoForm(request.POST)
        if form.is_valid():
            form.save(pk)

            return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': pk}))
    else:
        form = AddCollegamentoEsternoForm()

    return render(request, 'Sacher/add_collegamento_esterno.html', {'form': form})


@login_required()
def op_update_collegamento_esterno(request, pk, ln_pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    if request.method == 'POST':
        form = UpdateCollegamentoEsternoForm(ln_pk, request.POST)
        if form.is_valid():
            form.save(pk, ln_pk=ln_pk)

            return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': pk}))
    else:
        form = UpdateCollegamentoEsternoForm(ln_pk)

    return render(request, 'Sacher/add_collegamento_esterno.html', {'form': form})


@login_required()
def collegamento_esterno_delete(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    ln = CollegamentoEsterno.objects.get(pk=pk)
    op_pk = ln.operazione_id
    ln.delete()

    return HttpResponseRedirect(reverse('sacher:operazione_detail', kwargs={'pk': op_pk}))


# -------------------
# REST SERVICE
# -------------------

# @insert
@login_required()
@ajax
def rest_get_3dref(request, pk):
    # pk: pk del ref3d
    if request.method == 'POST':
        ref = get_object_or_404(Ref3D, pk=pk)
        serializer = Ref3dSerializer(ref)
        return JSONResponse(serializer.data)
    else:
        raise Http404


# @insert
@login_required()
@ajax
def rest_delete_3dref(request, pk):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    # pk: pk del ref3d
    if request.method == 'POST':
        ref = get_object_or_404(Ref3D, pk=pk)
        ref.delete()
        return JSONResponse('{}')
    else:
        raise Http404


# @insert
@login_required()
@ajax
def rest_update_3dref(request, pk):
    # pk: pk del ref3d
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    ref = get_object_or_404(Ref3D, pk=pk)

    if request.method == 'POST':
        data = json.loads(request.POST['current_spot_data'])
        # data = JSONParser().parse(request.POST['current_spot_data'])
        serializer = Ref3dSerializer(ref, data=data)
        if serializer.is_valid():
            serializer.save()

            return JSONResponse(serializer.data, status=200)
        return JSONResponse(serializer.errors, status=400)
    else:
        raise Http404


@login_required
@ajax
def rest_create_3dref(request):
    if request.method == 'POST':
        data = request.POST['current_spot_data']
        data = json.loads(data)
        serializer = Ref3dSerializer(data=data)
        if serializer.is_valid():
            new_ref = serializer.save()
            new_serializer = Ref3dSerializer(new_ref)

            return JSONResponse(new_serializer.data, status=200)
        return JSONResponse(serializer.errors, status=400)
    else:
        raise Http404


@login_required
@ajax
def rest_set_home_view(request):
    if request.method == 'POST':
        # data = JSONParser().parse(request)
        data = request.POST
        if 'matrix' not in data or 'models' not in data:
            return HttpResponse(status=500)

        models = (data['models'])
        models = ast.literal_eval(models)
        for mod_pk in models:
            mod3d = get_object_or_404(Modello3d, pk=mod_pk)
            if mod3d.vista_iniziale is None or mod3d.vista_iniziale == '':
                mod3d.vista_iniziale = data['matrix']
            else:
                # mod3d.vista_iniziale = string_mat_mul(mod3d.vista_iniziale, data['matrix'])
                mod3d.vista_iniziale = data['matrix']
            mod3d.save()
        return
    else:
        raise Http404


@login_required
@ajax
def retrieve_op_info(request):
    if request.method == 'POST':
        if request.POST['bc_id'] is None:
            return HttpResponse(status=403)
        bc_id = int(request.POST['bc_id'])
        response = {}
        # response['ambiti'] = Ambito.objects.filter(progetto=bc_id, padre=None).values('id', 'nome')
        ambiti = Ambito.objects.filter(progetto=bc_id, padre=None).values('id', 'nome')
        response['ambiti'] = [a for a in ambiti if Ambito.objects.filter(progetto=bc_id, padre=a['id']).count() > 0]
        response['attivita'] = Attivita.objects.filter(progetto=bc_id).values('id', 'nome')
        response['responsabili'] = list(str(User.objects.all()))
        response['elementi'] = Elemento.objects.filter(bene_culturale=bc_id).values('id', 'nome').order_by('nome')
        return JSONResponse(response)
    else:
        raise Http404


@login_required
@ajax
def save_op(request):
    if request.method == 'POST':
        data = request.POST

        if data.get('elemento') is None:
            return HttpResponse(status=404)
        try:
            if data.get('op'):
                # Operazione già esistente, aggiorno i campi
                pk = int(data.get('op'))
                op = Operazione.objects.get(pk=pk)
                op.titolo = data.get('titolo')
                op.attivita_id = int(data.get('attivita'))
                op.ambito_id = int(data.get('ambito'))
                if data.get('descrizione') != '':
                    op.descrizione = data.get('descrizione')
                else:
                    op.descrizione = None
                op.elemento_id = int(data.get('elemento'))
                op.compilatore_id = request.user.id

                if data.get('responsabile'):
                    u = data.get('responsabile')
                    op.responsabile = get_user_model().objects.get(username=u)
                if data.get('data_inizio'):
                    op.data_inizio = data.get('data_inizio')
                if data.get('data_fine'):
                    op.data_fine = data.get('data_fine')
                op.save()
            else:
                op = Operazione()
                op.titolo = data.get('titolo')
                op.attivita_id = int(data.get('attivita'))
                op.ambito_id = int(data.get('ambito'))
                if data.get('descrizione') != '':
                    op.descrizione = data.get('descrizione')
                else:
                    op.descrizione = None
                op.elemento_id = int(data.get('elemento'))
                op.compilatore_id = request.user.id

                if data.get('responsabile'):
                    u = data.get('responsabile')
                    op.responsabile = get_user_model().objects.get(username=u)
                if data.get('data_inizio'):
                    op.data_inizio = data.get('data_inizio')
                if data.get('data_fine'):
                    op.data_fine = data.get('data_fine')

                op.save()
                pk = str(op.id)

            if request.FILES:
                files = request.FILES.getlist('files')

                for f in files:
                    sane_bc_nome = sanitize_filename(op.elemento.bene_culturale.nome)
                    # il path generico è: sacher_files/palazzo_del_podesta/8/, 8 è la pk dell'operazione
                    ss = storage.SwiftStorage()
                    name = path.join('sacher_files', sane_bc_nome, str(pk), f.name)
                    name = ss.save(name, f)

                    file_url = path.join(settings.MEDIA_URL, name)
                    file_url = file_url.replace('\\', '/')

                    f_ext = os.path.splitext(f.name)[1][1:]

                    dbfile = File()
                    dbfile.path = file_url
                    dbfile.operazione_id = op.id

                    # Salvo anche la versione thumbnail in caso di immagine
                    if f_ext in images_ext:
                        name = path.join('sacher_files', sane_bc_nome, str(pk), 'thumbnail', f.name)
                        pil_img = PIL.Image.open(f)
                        pil_img.thumbnail((200, 200))
                        pil_img = pil_img.convert('RGB')

                        pil_img_b = io.BytesIO()
                        pil_img.save(pil_img_b, format='JPEG')
                        img_bytes = ContentFile(pil_img_b.getvalue())
                        name = ss.save(name, img_bytes)
                        file_url_thumbnail = path.join(settings.MEDIA_URL, name)
                        file_url_thumbnail = file_url_thumbnail.replace('\\', '/')
                        dbfile.path_thumbnail = file_url_thumbnail

                    dbfile.save()
        except PermissionDenied:
            error = "Forbidden (Permission denied): Can't add extra information to operation"
            print error
            return HttpResponse(content=error, status=403)
        except Exception, e:
            print str(e)
            return HttpResponse(content=str(e), status=500)
    else:
        return HttpResponse(status=403)


@login_required()
@ajax
def save_op_full(request, op):
    # ret = group_allowed_function(request, insert)
    # if ret is not None:
    #     return ret

    data = request.POST
    try:
        if data.get('responsabile'):
            u = data.get('responsabile')
            op.responsabile = get_user_model().objects.get(username=u)
        if data.get('data_inizio'):
            op.data_inizio = data.get('data_inizio')

        op.save()
        pk = str(op.id)

        if request.FILES:
            files = request.FILES.getlist('files')

            for f in files:
                sane_bc_nome = sanitize_filename(op.elemento.bene_culturale.nome)
                # il path generico è: sacher_files/palazzo_del_podesta/8/, 8 è la pk dell'operazione
                ss = storage.SwiftStorage()
                name = path.join('sacher_files', sane_bc_nome, pk, f.name)
                name = ss.save(name, f)

                # file_url = path.join(settings.MEDIA_URL, name)

                # fdir = path.join(settings.MEDIA_ROOT, 'sacher_files', sane_bc_nome, pk)

                # if not path.exists(fdir):
                #     os.makedirs(fdir)
                #
                # fpath = path.join(fdir, f.name)
                #
                # # chunks itera sul file con chunk di 64K (default). Evita di caricare tutti il file in memoria
                # with open(fpath, 'wb+') as destination:
                #     for chunk in f.chunks():
                #         destination.write(chunk)

                file_url = path.join(settings.MEDIA_URL, name)
                file_url = file_url.replace('\\', '/')

                dbfile = File()
                dbfile.path = file_url
                dbfile.operazione_id = op.id
                dbfile.save()
    except Exception, e:
        print str(e)
        return HttpResponse(str(e), status=500)


@login_required
@ajax
def create_bc(request):
    if request.method == 'POST':
        data = request.POST
        bc = BeneCulturale()
        try:
            bc.nome = data.get('nome')

            if data.get('altra_den'):
                bc.altra_denominazione = data.get('altra_den')

            if data.get('descrizione'):
                bc.descrizione = data.get('descrizione')

            if data.get('ICCD'):
                bc.id_iccd = data.get('ICCD')

            if data.get('qualificazione'):
                bc.categoria_id = data.get('qualificazione')
            elif data.get('def_tipologica'):
                bc.categoria_id = data.get('def_tipologica')
            elif data.get('macrocategoria'):
                bc.categoria_id = data.get('macrocategoria')

            if data.get('localizzazione'):
                bc.localita = data.get('localizzazione')

            if data.get('datazione'):
                bc.datazione = data.get('datazione')

            if data.get('autore'):
                bc.autore = data.get('autore')

            if data.get('ente'):
                bc.ente = data.get('ente')

            if data.get('sito-web'):
                bc.sito_web = data.get('sito-web')

            if data.get('email'):
                bc.email = data.get('email')

            if data.get('telefono'):
                bc.phone_number = data.get('telefono')

            if data.get('tag'):
                bc.tags = data.get('tag')

            if data.get('lat'):
                bc.lat = data.get('lat')

            if data.get('lng'):
                bc.lon = data.get('lng')

            if data.get('link'):
                bc.external_link = data.get('link')

            bc.save()
            bc_pk = str(bc.id)

            if request.FILES:
                files = request.FILES.getlist('file-upload')

                for f in files:
                    # il path generico è: bc_imgs/bc_pk/

                    name = path.join(bc_pk, f.name)
                    name = name.replace('\\', '/')
                    f._name = name
                    # f.name = name
                    ss = storage.SwiftStorage()
                    img = Immagine()
                    img.img = f
                    # img.img.name = name
                    img.bc_id = bc.id
                    img.save()

            if data.get('details'):
                create_bc_details(data)

            # for ambito in ambiti:
            #     a = Ambito()
            #     a.nome = ambito
            #     a.progetto_id = bc.id
            #     a.save()
            crea_ambiti(bc)
            for att in attivita:
                a = Attivita()
                a.nome = att
                a.progetto_id = bc.id
                a.save()

        except PermissionDenied:
            error = "Forbidden (Permission denied): Can't add extra information to operation"
            print error
            return HttpResponse(content=error, status=403)
        except Exception, e:
            print str(e)
            return HttpResponse(content=str(e), status=500)
    else:
        return HttpResponse(status=403)


def create_bc_details(bc, data):
    if data.get('keycode_sigec'):
        bc.keycode_iccd = data.get('keycode_sigec')
    if data.get('ambito_culturale'):
        bc.beneculturaledetails.ambito_culturale = data.get('ambito_culturale')
    if data.get('epoca_prima_attestazione'):
        bc.beneculturaledetails.epoca_prima_attestazione = data.get('epoca_prima_attestazione')
    if data.get('pseudonimo'):
        bc.beneculturaledetails.pseudonimo = data.get('pseudonimo')
    if data.get('ente_schedatore'):
        bc.beneculturaledetails.ente_schedatore = data.get('ente_schedatore')
    if data.get('tipo_proprieta'):
        bc.beneculturaledetails.tipo_proprieta = data.get('tipo_proprieta')
    if data.get('proprietario'):
        bc.beneculturaledetails.proprietario = data.get('proprietario')
    if data.get('dati_catastali'):
        bc.beneculturaledetails.dati_catastali = data.get('dati_catastali')
    if data.get('stato_conservazione'):
        bc.beneculturaledetails.stato_conservazione = data.get('stato_conservazione')
    if data.get('uso_attuale'):
        bc.beneculturaledetails.uso_attuale = data.get('uso_attuale')
    if data.get('uso_storico'):
        bc.beneculturaledetails.uso_storico = data.get('uso_storico')
    if data.get('condizione_giuridica'):
        bc.beneculturaledetails.condizione_giuridica = data.get('condizione_giuridica')
    if data.get('tipo_tutela'):
        bc.beneculturaledetails.tipo_tutela = data.get('tipo_tutela')
    if data.get('provvedimenti_tutela'):
        bc.beneculturaledetails.provvedimenti_tutela = data.get('provvedimenti_tutela')

    bc.save()


@login_required
@ajax
def edit_bc(request):
    if request.method == 'POST':
        data = request.POST
        bc_id = int(data.get('bc_id'))
        if bc_id is None:
            return HttpResponse(status=400)
        bc = BeneCulturale.objects.get(pk=bc_id)
        try:
            bc.nome = data.get('nome')

            if data.get('altra_den'):
                bc.altra_denominazione = data.get('altra_den')

            if data.get('descrizione') != '':
                bc.descrizione = data.get('descrizione')
            else:
                bc.descrizione = None

            if data.get('ICCD'):
                bc.id_iccd = data.get('ICCD')

            if data.get('qualificazione'):
                bc.categoria_id = data.get('qualificazione')
            elif data.get('def_tipologica'):
                bc.categoria_id = data.get('def_tipologica')
            elif data.get('macrocategoria'):
                bc.categoria_id = data.get('macrocategoria')

            if data.get('localizzazione'):
                bc.localita = data.get('localizzazione')

            if data.get('datazione'):
                bc.datazione = data.get('datazione')

            if data.get('autore'):
                bc.autore = data.get('autore')

            if data.get('ente'):
                bc.ente = data.get('ente')

            if data.get('sito-web'):
                bc.sito_web = data.get('sito-web')

            if data.get('email'):
                bc.email = data.get('email')

            if data.get('telefono'):
                bc.phone_number = data.get('telefono')

            if data.get('tag'):
                bc.tags = data.get('tag')

            if data.get('lat'):
                bc.lat = data.get('lat')

            if data.get('lng'):
                bc.lon = data.get('lng')

            if data.get('link'):
                bc.external_link = data.get('link')

            bc.save()
            bc_pk = str(bc_id)

            if data.get('details'):
                edit_bc_details(bc, data)

            if data.get('imgs_to_remove'):
                imgs_to_remove = data.get('imgs_to_remove').split(",")
                # imgs_to_remove =
                for img_id in imgs_to_remove:
                    img = Immagine.objects.get(pk=int(img_id))
                    img.delete()

            if request.FILES:
                files = request.FILES.getlist('file-upload')

                for f in files:
                    # il path generico è: bc_imgs/bc_pk/

                    name = path.join(bc_pk, f.name)
                    name = name.replace('\\', '/')
                    f._name = name
                    # f.name = name
                    ss = storage.SwiftStorage()
                    img = Immagine()
                    img.img = f
                    # img.img.name = name
                    img.bc_id = bc.id
                    img.save()
        except PermissionDenied:
            error = "Forbidden (Permission denied): Can't add extra information to operation"
            print error
            return HttpResponse(error, status=403)
        except Exception, e:
            print str(e)
            return HttpResponse(str(e), status=500)
    else:
        return HttpResponse(status=403)


def edit_bc_details(bc, data):
    if data.get('keycode_sigec'):
        bc.keycode_iccd = data.get('keycode_sigec')
    if data.get('ambito_culturale'):
        bc.beneculturaledetails.ambito_culturale = data.get('ambito_culturale')
    if data.get('epoca_prima_attestazione'):
        bc.beneculturaledetails.epoca_prima_attestazione = data.get('epoca_prima_attestazione')
    if data.get('pseudonimo'):
        bc.beneculturaledetails.pseudonimo = data.get('pseudonimo')
    if data.get('ente_schedatore'):
        bc.beneculturaledetails.ente_schedatore = data.get('ente_schedatore')
    if data.get('tipo_proprieta'):
        bc.beneculturaledetails.tipo_proprieta = data.get('tipo_proprieta')
    if data.get('proprietario'):
        bc.beneculturaledetails.proprietario = data.get('proprietario')
    if data.get('dati_catastali'):
        bc.beneculturaledetails.dati_catastali = data.get('dati_catastali')
    if data.get('stato_conservazione'):
        bc.beneculturaledetails.stato_conservazione = data.get('stato_conservazione')
    if data.get('uso_attuale'):
        bc.beneculturaledetails.uso_attuale = data.get('uso_attuale')
    if data.get('uso_storico'):
        bc.beneculturaledetails.uso_storico = data.get('uso_storico')
    if data.get('condizione_giuridica'):
        bc.beneculturaledetails.condizione_giuridica = data.get('condizione_giuridica')
    if data.get('tipo_tutela'):
        bc.beneculturaledetails.tipo_tutela = data.get('tipo_tutela')
    if data.get('provvedimenti_tutela'):
        bc.beneculturaledetails.provvedimenti_tutela = data.get('provvedimenti_tutela')

    bc.save()


@login_required
@ajax
def edit_element(request):
    if request.method == 'POST':
        data = request.POST
        el_id = int(data.get('elem_id'))
        if el_id is None:
            return HttpResponse(status=400)
        el = Elemento.objects.get(pk=el_id)
        try:
            el.nome = data.get('name')

            if data.get('desc') != '':
                el.descrizione = data.get('desc')
            else:
                el.descrizione = ''

            if data.get('parent') != '':
                el.padre_id = int(data.get('parent'))
            else:
                el.padre = None
            el.save()
            return HttpResponse(content="Salvato", status=200)

        except PermissionDenied:
            error = "Forbidden (Permission denied): Can't add extra information to operation"
            print error
            return HttpResponse(content=error, status=403)
        except Exception, e:
            print str(e)
            return HttpResponse(content=str(e), status=500)
    else:
        return HttpResponse(status=403)


@login_required
@ajax
def get_element(request):
    if request.method == 'POST':
        pk = request.POST.get('elem_id')
        elemento = Elemento.objects.get(pk=pk)
        serializer = ElementoSerializer(elemento)
        return JSONResponse(serializer.data)


@login_required
def profile(request):
    if request.method == 'POST':
        pass
    else:
        stats = {}
        bbcc = BeneCulturale.objects.all()
        stats['bbcc'] = bbcc.count()
        stats['bbcc_mod3d'] = BeneCulturale.objects.filter(elemento__modello3d__isnull=False).distinct().count()
        stats['utenti'] = User.objects.all().count()
        op = Operazione.objects.all()
        stats['op'] = op.count()

        diff = datetime.timedelta(0)
        for o in op:
            if o.data_fine is None or o.data_inizio is None:
                continue
            diff += o.data_fine - o.data_inizio
        stats['op_giorni'] = diff.days

        attivita = Attivita.objects.all().values_list('nome', flat=True).distinct()
        stats['attivita'] = attivita
        lista_prog = []
        for b in bbcc:
            data = {}
            if not UtenteBC.objects.filter(bene_culturale=b, utente=request.user).exists():
                pass
            data['bc'] = b
            data['utenti'] = UtenteBC.objects.filter(bene_culturale=b).count()
            data['immagini'] = File.objects.filter(operazione__elemento__bene_culturale=b).count()
            data['operazioni'] = Operazione.objects.filter(elemento__bene_culturale=b).count()
            data['operazioni_attivita'] = [Operazione.objects.filter(elemento__bene_culturale=b, attivita__nome__exact=a).count() for a in attivita]

            lista_prog.append(data)
        stats['data'] = lista_prog

        stats['progetti_utente'] = UtenteBC.objects.filter(utente=request.user).count()
        stats['operazioni_utente'] = Operazione.objects.filter(compilatore=request.user).count()

        return render(request, 'Sacher/profile.html', stats)


@login_required
@ajax
def update_profile(request):
    # Aggiorno i dati del profilo
    if request.method == 'POST':
        user = request.user
        phone = request.POST.get('phone')
        curriculum = request.POST.get('curriculum')
        organization = request.POST.get('organization')
        website = request.POST.get('website')
        avatar = request.FILES.get('img')
        try:
            profile = Profile.objects.get(pk=user.id)
            if profile.phone != phone and phone is not None:
                profile.phone = phone
            if profile.curriculum != curriculum and curriculum is not None:
                profile.curriculum = curriculum
            if profile.organization != organization and organization is not None:
                profile.organization = organization
            if profile.website != website and website is not None:
                profile.website = website
            if avatar is not None:
                profile.avatar = avatar
            profile.save()
        except:
            return HttpResponse(status=500)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=500)


@login_required
def projects(request):
    """ Recupera i progetti dell'utente corrente, mostrando i collaboratori inciascuno di questi """
    if request.method == 'GET':
        content = {}

        # Se manage è true, l'utente corrente può gestire almeno un progetto
        manager = False
        current_user_is_ente = request.user.groups.filter(name__in=ente[0]).exists()

        # Recupero i progetti su cui lavora l'utente
        pjs = UtenteBC.objects.filter(utente=request.user)

        if current_user_is_ente:
            pjs_all = BeneCulturale.objects.exclude(id__in=pjs.values('bene_culturale')).order_by('nome')
            for p in pjs_all:
                users = UtenteBC.objects.filter(bene_culturale=p).order_by('bene_culturale', 'ruolo').values_list('utente__id', 'utente__username', 'ruolo_id', 'ruolo__name')
                content[p.id] = {
                    'bc_nome': p.nome,
                    'users': users,
                    'can_manage': True,
                    'display': False,
                }

        # Per ogni progetto recupero gli utenti che collaborano con lui
        for p in pjs:
            # users = UtenteBC.objects.filter(bene_culturale=p.bene_culturale).order_by('utente_id')
            users = UtenteBC.objects.filter(bene_culturale=p.bene_culturale).order_by('bene_culturale', 'ruolo')
            perm = users.get(utente=request.user).ruolo.name

            content[p.bene_culturale.id] = {
                'bc_nome': p.bene_culturale.nome,
                'users': users.values_list('utente__id', 'utente__username', 'ruolo_id', 'ruolo__name'),
                'can_manage': True if perm == "project_manager" or current_user_is_ente is True else False,
                'display': True,
            }
            if perm == "project_manager" or current_user_is_ente is True:
                manager = True
        groups = Group.objects.exclude(name__contains='ente')
        if current_user_is_ente:
            users = User.objects.all()
        else:
            users = User.objects.exclude(id=int(request.user.id))  # exclude the current user
        return render(request, 'Sacher/projects.html', {'content': content, 'groups': groups, 'users': users, 'manage': manager})


@login_required
@ajax
def set_perm(request):
    if request.method == 'POST':
        data = request.POST
        # Recupero tutti gli utenti per un determinati BC e cambio i permessi, se necessario
        if not data.get('bc_id'):
            return HttpResponse(status=500)
        bc_id = data.get('bc_id')
        try:
            if not data.get('usrs'):
                return HttpResponse(status=500)
            users_new = json.loads(data.get('usrs'))
            users_bc = UtenteBC.objects.filter(bene_culturale_id=bc_id)
            users_bc = users_bc.exclude(utente_id=request.user.id)
            check = []
            for key in users_new:
                if int(key) == request.user.id:
                    continue
                t = User.objects.get(pk=key)
                check.append(t)
                if users_bc.filter(utente_id=key).exists():  # L'utente corrente è già stato assegnato a questo BC
                    u = users_bc.get(utente_id=key)
                    if users_new[key] != u.ruolo_id:
                        # Il ruolo è cambiato e devo aggiornarlo
                        u.ruolo_id = users_new[key]
                        u.save()
                else:  # L'utente corrente deve essere assegnato a questo BC
                    new_user = UtenteBC()
                    new_user.ruolo_id = users_new[key]
                    new_user.utente_id = key
                    new_user.bene_culturale_id = bc_id
                    new_user.save()
            # Se un utente già assegnato non viene "trasmesso", allora devo eliminarlo dal BC corrente
            users_bc = list([u.utente for u in users_bc])
            users_to_remove = [a for a in users_bc + check if (a in users_bc) and (a not in check)]
            for u in users_to_remove:
                UtenteBC.objects.get(bene_culturale_id=bc_id, utente_id=u.id).delete()
        except Exception, e:
            print str(e)
            return HttpResponse(str(e), status=500)

    return HttpResponse(status=200)


@login_required
@ajax
def get_subcategory(request):
    if request.method == 'POST':
        desired_category = request.POST.get('desired_category')
        parent_id = request.POST.get('selected_id')

        # category = Categoria.objects.filter(tipo=desired_category, sovracategoria=parent_id).values_list('id', 'nome')
        category = Categoria.objects.filter(tipo=desired_category, sovracategoria=parent_id).values('id', 'nome')
        return JSONResponse(category)


@login_required
@ajax
def get_ambiti(request):
    if request.method == 'POST':
        bc_id = int(request.POST.get('bc_id'))
        parent_id = int(request.POST.get('parent_id'))
        ambiti = Ambito.objects.filter(progetto_id=bc_id, padre_id=parent_id).values('id', 'nome')

        return JSONResponse(ambiti)


@login_required
@ajax
def add_model(request):
    el_id = request.POST.get('elem_id')
    el = Elemento.objects.get(pk=el_id)

    if request.method == 'POST':
        sane_bc_nome = sanitize_filename(el.bene_culturale.nome)
        anno = int(request.POST.get('anno'))

        if request.FILES.get('ply_model_file') and request.FILES.get('texture_file'):
            # Save the files
            model = request.FILES['ply_model_file']
            texture = request.FILES['texture_file']

            # Check the extensions
            if not model.name.endswith('.ply') or not texture.name.endswith(tuple(images_ext)):
                return

            directory = path.join(settings.BASE_DIR, 'media', 'sacher_files', sane_bc_nome)
            # Create the folder if does not exist
            if not os.path.exists(directory):
                os.makedirs(directory)

            # Set the texture name equal to the model one
            model_name = model.name.split('.')[0]
            texture.name = model_name + '.' + texture.name.split('.')[1]

            model_path = path.join(directory, model.name)
            with open(model_path, 'wb+') as destination:
                for chunk in model.chunks():
                    destination.write(chunk)

            texture_path = path.join(directory, texture.name)
            with open(texture_path, 'wb+') as destination:
                for chunk in texture.chunks():
                    destination.write(chunk)

            output_name = model_name + '_' + str(anno)
            commands = ' -o ' + output_name
            # Combine the two file creating the .nxs one
            # subprocess.Popen('../nxsbuild ' + model.name + commands, shell=True, cwd=directory)
            subprocess.call('../nxsbuild ' + model.name + commands, shell=True, cwd=directory)  # Bloccante
            # FNULL = open(os.devnull, 'w') sopprime output
            # retcode = subprocess.call(['echo', 'foo'], stdout=FNULL, stderr=subprocess.STDOUT)

            # Sposto il modello su swift
            ss = storage.SwiftStorage()
            name = path.join('sacher_files', sane_bc_nome, output_name + '.nxs')
            f = open(path.join(directory, output_name + '.nxs'), 'rb+')
            name = ss.save(name, f)

            # elimino i file appena creati in locale
            os.remove(model_path)
            os.remove(texture_path)
            os.remove(path.join(directory, output_name + '.nxs'))

            model_url = path.join(settings.MEDIA_URL, name)
            model_url = model_url.replace('\\', '/')

            mod3d = Modello3d()
            mod3d.path = model_url
            mod3d.elemento = el
            mod3d.nome = model_name
            mod3d.anno = anno
            mod3d.vista_iniziale = None
            mod3d.save()
        elif request.FILES.get('nxs_model_file'):
            f = request.FILES['nxs_model_file']
            ss = storage.SwiftStorage()
            name = path.join('sacher_files', sane_bc_nome, f.name)
            name = ss.save(name, f)

            file_url = path.join(settings.MEDIA_URL, name)
            file_url = file_url.replace('\\', '/')

            model_name = f.name.split('.')[0]

            mod3d = Modello3d()
            mod3d.path = file_url
            mod3d.elemento = el
            mod3d.nome = model_name
            mod3d.anno = anno
            mod3d.vista_iniziale = None
            mod3d.save()
        else:
            HttpResponse(status=500)
    else:
        HttpResponse(status=500)
    HttpResponse(status=200)


# @ajax
@login_required
def download_op(request, pk):
    if request.method == 'GET':
        op_id = pk
        try:
            op = Operazione.objects.get(pk=op_id)
            files = File.objects.filter(operazione=op)
            q = Q()
            for ext in images_ext:
                q |= Q(path__endswith=ext)

            notq = Q()
            for ext in images_ext:
                notq &= ~Q(path__endswith=ext)

            images = files.filter(q)
            files = files.filter(notq)
            fpath = export_pdf(op.elemento.bene_culturale, op, images, files)
            with open(fpath, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/pdf")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(fpath)
                return response
        except Exception as e:
            print e
            return HttpResponse(content='Errore del server', status=500)


@login_required
def gestione_beni(request):
    if request.method == 'GET':
        response = {}

        # Controllo se l'utente corrente ha i privilegi per gestire almeno un bene
        current_user_is_ente = request.user.groups.filter(name__in=ente[0]).exists()
        if not UtenteBC.objects.filter(utente=request.user, ruolo__name__in=mananger[0]).exists() and current_user_is_ente is False:
            raise PermissionDenied("Accesso negato")

        response['bbcc'] = BeneCulturale.objects.all().order_by('nome')
        # Aggiungo le macrocategorie, mentre le def tiplogiche e qulificazioni verranno caricate con richieste ajax
        response['macrocategorie'] = Categoria.objects.filter(tipo=Categoria.TIPO_CHOICES[0][0])
        # Aggiungo tutte le immagini collegate ai BBCC
        response['bc_imgs'] = Immagine.objects.all()
        response['epoche'] = list(zip(*BeneCulturale.DATAZIONE_CHOICES)[0])

        return render(request, 'Sacher/gestione_beni.html', response)
    else:
        raise PermissionDenied("Accesso negato")


# -------------------
# AUTHENTICATION
# -------------------

def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            return HttpResponseRedirect(reverse('sacher:home'))
        else:
            # Return an 'invalid login' error message.
            # TODO gestire errore
            return HttpResponseRedirect(reverse('sacher:home'))
            # return HttpResponse(status=404)


@login_required
@ajax
def create_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        name = request.POST['nome']
        surname = request.POST['cognome']

        try:
            validate_email(username)
        except ValidationError:
            return HttpResponse(content='Indirizzo email non valido', status=400)
        # Email valid!
        if User.objects.filter(username=username).exists():
            # Username già esistente
            return HttpResponse(content='Utente già esistente', status=400)
        try:
            user = User.objects.create_user(username, email=username, password=username)
            user.first_name = name
            user.last_name = surname
            user.save()
        except Exception as e:
            print e
            return HttpResponse(content='Errore del server', status=500)
        return HttpResponse(status=200)


@login_required
def test(request):
    bbcc = BeneCulturale.objects.all()

    for bc in bbcc:
        if BeneCulturaleDetails.objects.filter(bc=bc).exists():
            print "esiste gia per " + bc.nome
        else:
            BeneCulturaleDetails.objects.create(bc=bc)

    return HttpResponse(status=200)
