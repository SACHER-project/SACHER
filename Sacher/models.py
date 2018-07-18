# -*- coding: utf-8 -*-

from __future__ import unicode_literals, division

import os

from django.conf import settings
from django.contrib.auth.models import User, Group
from django.core.validators import MaxValueValidator, MinValueValidator, URLValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template import Template, Context
from django.urls import reverse

from utils import local_path_from_media_path

# Create your models here.
AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


class DetailMixin():
    def _get_context(self):
        return Context(
            {'items': [{'name': x.name, 'value': getattr(self, x.name)} for x in self._meta.fields if x.name != 'id']})

    def as_ul(self):
        t = Template('<ul>{% for i in items %}<li>{{ i.name|title }}: {{ i.value }}</li>{% endfor %}</ul>')
        return t.render(self._get_context())

    def as_p(self):
        t = Template('{% for i in items %}<p>{{ i.name|title }}: {{ i.value }}</p>{% endfor %}')
        return t.render(self._get_context())

    def as_table(self):
        t = Template('{% for i in items %}<tr><td>{{ i.name|title }}</td><td>{{ i.value }}</td></tr>{% endfor %}')
        return t.render(self._get_context())


class OperazioneDetailMixin(DetailMixin):
    def _get_fileds_as_dict(self):
        return {x.name: getattr(self, x.name) for x in self._meta.fields if x.name != 'id'}

    def as_table(self):
        flds = self._get_fileds_as_dict()
        if flds['data_inizio'] == flds['data_fine']:
            flds['data'] = flds['data_inizio']
            del flds['data_inizio']
            del flds['data_fine']

        ctx = Context({'items': [{'name': key, 'value': val} for (key, val) in flds.items()]})
        ctx['items'] = sorted(ctx['items'], key=lambda k: k['name'])

        t = Template('{% for i in items %}<tr><td>{{ i.name|title }}</td><td>{{ i.value|safe }}</td></tr>{% endfor %}')
        return t.render(ctx)


class Categoria(models.Model):
    """Categorie, definizioni tipologiche e qualificazioni per Beni Culturali"""
    nome = models.CharField(max_length=256)

    TIPO_CHOICES = (
        ('MACROCATEGORIA', 'Macrocategoria'),
        ('DEF_TIPOLOGICA', 'Definizione tipologica'),
        ('QUALIFICAZIONE', 'Qualificazione'),
    )
    tipo = models.CharField(max_length=14, choices=TIPO_CHOICES, default='MACROCATEGORIA')
    id_iccd = models.CharField(max_length=256, blank=True, null=True)
    sovracategoria = models.ForeignKey('self', null=True, blank=True)

    def __unicode__(self):
        return self.tipo + ' - ' + self.nome

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorie'


class BeneCulturale(models.Model, DetailMixin):
    nome = models.CharField(max_length=256)
    altra_denominazione = models.CharField(max_length=256, blank=True, null=True)
    descrizione = models.TextField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    keycode_iccd = models.CharField(max_length=2048, blank=True, null=True)
    localita = models.CharField(max_length=256, blank=True, null=True)
    id_iccd = models.CharField(max_length=256, blank=True, null=True)

    categoria = models.ForeignKey(Categoria, blank=True, null=True)

    DATAZIONE_CHOICES = (
        ('AC', 'AC'),
        ('I', 'I'),
        ('II', 'II'),
        ('III', 'III'),
        ('IV', 'IV'),
        ('V', 'V'),
        ('VI', 'VI'),
        ('VII', 'VII'),
        ('VIII', 'VIII'),
        ('IX', 'IX'),
        ('X', 'X'),
        ('XI', 'XI'),
        ('XII', 'XII'),
        ('XIII', 'XIII'),
        ('XIV', 'XIV'),
        ('XV', 'XV'),
        ('XVI', 'XVI'),
        ('XVII', 'XVII'),
        ('XVIII', 'XVIII'),
        ('XIX', 'XIX'),
        ('XX', 'XX'),
        ('XXI', 'XXI'),
    )
    datazione = models.CharField(blank=True, null=True, choices=DATAZIONE_CHOICES, max_length=10)
    autore = models.CharField(max_length=256, blank=True, null=True)
    ente = models.CharField(max_length=256, blank=True, null=True)
    sito_web = models.TextField(validators=[URLValidator()], blank=True, null=True)
    email = models.EmailField(max_length=70, blank=True, null=True)
    # phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
    #                              message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    # phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)  # validators should be a list
    phone_number = models.CharField(max_length=14, blank=True, null=True)
    tags = models.CharField(max_length=256, blank=True, null=True)
    external_link = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return self.nome

    def get_absolute_url(self):
        return reverse('sacher:bc_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'Bene Culturale'
        verbose_name_plural = 'Beni Culturali'


class BeneCulturaleDetails(models.Model):
    bc = models.OneToOneField(BeneCulturale, on_delete=models.CASCADE)
    ambito_culturale = models.CharField(max_length=256, blank=True, null=True)
    epoca_prima_attestazione = models.CharField(max_length=256, blank=True, null=True)
    pseudonimo = models.CharField(max_length=256, blank=True, null=True)
    ente_schedatore = models.CharField(max_length=256, blank=True, null=True)
    tipo_proprieta = models.CharField(max_length=256, blank=True, null=True)
    proprietario = models.CharField(max_length=256, blank=True, null=True)
    dati_catastali = models.CharField(max_length=256, blank=True, null=True)
    stato_conservazione = models.CharField(max_length=256, blank=True, null=True)
    uso_attuale = models.CharField(max_length=256, blank=True, null=True)
    uso_storico = models.CharField(max_length=256, blank=True, null=True)
    condizione_giuridica = models.CharField(max_length=256, blank=True, null=True)
    tipo_tutela = models.CharField(max_length=256, blank=True, null=True)
    provvedimenti_tutela = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        verbose_name = 'Bene Culturale Dettagli'
        verbose_name_plural = 'Beni Culturali Dettagli'


@receiver(post_save, sender=BeneCulturale)
def create_bc_details(sender, instance, created, **kwargs):
    if created:
        BeneCulturaleDetails.objects.create(bc=instance)


@receiver(post_save, sender=BeneCulturale)
def save_bc_details(sender, instance, **kwargs):
    instance.beneculturaledetails.save()


class Immagine(models.Model):
    bc = models.ForeignKey(BeneCulturale, related_name='immagini')
    img = models.ImageField(upload_to="bc_imgs/", null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Immagini'


class Materiale(models.Model):
    nome = models.CharField(max_length=256)

    def __unicode__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Materiali'


class Elemento(models.Model, DetailMixin):
    bene_culturale = models.ForeignKey(BeneCulturale)
    padre = models.ForeignKey('self', null=True, blank=True)
    nome = models.CharField(max_length=256)
    descrizione = models.TextField(blank=True)

    def get_all_children(self, include_self=True):
        r = []
        if include_self:
            r.append(self)
        for c in Elemento.objects.filter(padre=self):
            _r = c.get_all_children(include_self=True)
            if 0 < len(_r):
                r.extend(_r)
        return r

    def get_direct_children(self):
        return Elemento.objects.filter(padre=self)

    def __unicode__(self):
        return self.nome

    def get_absolute_url(self):
        return reverse('sacher:elemento_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name_plural = 'Elementi'


class Modello3d(models.Model):
    path = models.CharField(max_length=256, blank=True, null=True)
    anno = models.IntegerField()
    nome = models.CharField(max_length=256)
    elemento = models.ForeignKey(Elemento)
    vista_iniziale = models.CharField(max_length=2048, blank=True, null=True)

    def __unicode__(self):
        return self.nome

    def delete(self, using=None, keep_parents=False):
        fname = local_path_from_media_path(self.path)
        if os.path.isfile(fname):
            os.remove(fname)
        super(Modello3d, self).delete()

    class Meta:
        verbose_name = 'Modello 3D'
        verbose_name_plural = 'Modelli 3D'


class LinkElementoMateriale(models.Model):
    elemento = models.ForeignKey(Elemento)
    materiale = models.ForeignKey(Materiale)
    perc = models.FloatField()

    class Meta:
        verbose_name = 'LinkElementoMateriale'
        verbose_name_plural = 'LinkElementoMateriale'
        unique_together = (('elemento', 'materiale'),)


class UtenteBC(models.Model):
    bene_culturale = models.ForeignKey(BeneCulturale)
    utente = models.ForeignKey(AUTH_USER_MODEL)
    ruolo = models.ForeignKey(Group, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'UtentiBC'
        unique_together = (('bene_culturale', 'utente'),)


class SpotColor(models.Model):
    nome = models.CharField(max_length=256)
    descrizione = models.TextField(blank=True, null=True)
    r = models.PositiveSmallIntegerField(null=False, blank=False,
                                         validators=[MaxValueValidator(255), MinValueValidator(0)])
    g = models.PositiveSmallIntegerField(null=False, blank=False,
                                         validators=[MaxValueValidator(255), MinValueValidator(0)])
    b = models.PositiveSmallIntegerField(null=False, blank=False,
                                         validators=[MaxValueValidator(255), MinValueValidator(0)])

    def __unicode__(self):
        return self.nome

    def to_hex(self, with_sharp=True):
        s = '%0.2x%0.2x%0.2x' % (self.r, self.g, self.b)
        return '#' + s if with_sharp else s

    def to_float(self):
        return '[%f, %f, %f]' % (self.r / 255, self.g / 255, self.b / 255)

    def to_int(self):
        return '[%i, %i, %i]' % (self.r, self.g, self.b)

    class Meta:
        verbose_name = 'Colore Spot'
        verbose_name_plural = 'Colori Spot'


class Ambito(models.Model):
    nome = models.CharField(max_length=256)
    progetto = models.ForeignKey(BeneCulturale)
    colore = models.ForeignKey(SpotColor, blank=True, null=True)
    padre = models.ForeignKey('self', null=True, blank=True)

    def __unicode__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Ambiti'


class Attivita(models.Model):
    nome = models.CharField(max_length=256)
    progetto = models.ForeignKey(BeneCulturale)

    def __unicode__(self):
        return self.nome

    class Meta:
        verbose_name = 'Attività'
        verbose_name_plural = 'Attività'


class Operazione(models.Model, OperazioneDetailMixin):
    altre_op = models.ManyToManyField('self', blank=True)  # TODO non serve, distinguere op dal nome
    elemento = models.ForeignKey(Elemento)
    compilatore = models.ForeignKey(AUTH_USER_MODEL, related_name='rev_compilatore')  # TODO utente corrente
    responsabile = models.ForeignKey(AUTH_USER_MODEL, related_name='rev_responsabile', blank=True, null=True)  # TODO PM del BC a cui elemento si riferisce
    attivita = models.ForeignKey(Attivita)
    ambito = models.ForeignKey(Ambito)

    titolo = models.CharField(max_length=256)
    descrizione = models.TextField()
    tags = models.CharField(max_length=256, blank=True, null=True)
    data_inizio = models.DateField(blank=True, null=True)
    data_fine = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return self.titolo

    def get_absolute_url(self):
        return reverse('sacher:operazione_detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name_plural = 'Operazioni'


class File(models.Model):
    path = models.CharField(max_length=256)
    path_thumbnail = models.CharField(max_length=256, null=True, blank=True)
    operazione = models.ForeignKey(Operazione)
    url = models.URLField(max_length=2048, null=True, blank=True)
    descrizione = models.TextField(null=True, blank=True)

    def __unicode__(self):
        return os.path.basename(self.path)

    def filename(self):
        return os.path.basename(self.path)


class Ref3D(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    scale = models.FloatField()
    operazione = models.ForeignKey(Operazione)
    nome = models.CharField(max_length=256)
    descrizione = models.TextField()

    class Meta:
        verbose_name = 'Ref3D'
        verbose_name_plural = 'Ref3D'


class CollegamentoEsterno(models.Model, DetailMixin):
    operazione = models.ForeignKey(Operazione)
    nome = models.CharField(max_length=256, null=True, blank=True)
    url = models.URLField(max_length=2048, null=False, blank=False)

    def __unicode__(self):
        return self.url

    class Meta:
        verbose_name = 'Collegamento Esterno'
        verbose_name_plural = 'Collegamenti Esterni'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/')
    website = models.URLField(default='', blank=True)
    curriculum = models.TextField(default='', blank=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    organization = models.CharField(max_length=100, default='', blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
