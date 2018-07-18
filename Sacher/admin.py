from django.contrib import admin

from .models import *
from django.contrib.admin import AdminSite
from django.utils.translation import ugettext_lazy
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin


class SacherAdminSite(AdminSite):
    site_title = ugettext_lazy('SACHER ADMIN')
    site_header = ugettext_lazy('SACHER PROJECT')
    index_title = ugettext_lazy('SACHER Models')


class BeneCulturaleAdmin(admin.ModelAdmin):
    list_display = [f.name for f in BeneCulturale._meta.fields]


class BeneCulturaleDetailsAdmin(admin.ModelAdmin):
    list_display = [f.name for f in BeneCulturaleDetails._meta.fields]


class ImmagineAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Immagine._meta.fields]


class MaterialeAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Materiale._meta.fields]


class ElementoAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Elemento._meta.fields]


class Modello3dAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Modello3d._meta.fields]


class LinkElementoMaterialeAdmin(admin.ModelAdmin):
    list_display = [f.name for f in LinkElementoMateriale._meta.fields]


class UtenteBCAdmin(admin.ModelAdmin):
    list_display = [f.name for f in UtenteBC._meta.fields]


class AmbitoAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Ambito._meta.fields]


class AttivitaAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Attivita._meta.fields]


class OperazioneAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Operazione._meta.fields]


class FileAdmin(admin.ModelAdmin):
    list_display = [f.name for f in File._meta.fields]


class Ref3DAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Ref3D._meta.fields]


class CollegamentoEsternoAdmin(admin.ModelAdmin):
    list_display = [f.name for f in CollegamentoEsterno._meta.fields]


class SpotColorAdmin(admin.ModelAdmin):
    list_display = [f.name for f in SpotColor._meta.fields]


class ProfileAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Profile._meta.fields]


class CategoriaAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Categoria._meta.fields]


sacher_site = SacherAdminSite()

sacher_site.register(Group, GroupAdmin)
sacher_site.register(User, UserAdmin)
sacher_site.register(BeneCulturale, BeneCulturaleAdmin)
sacher_site.register(BeneCulturaleDetails, BeneCulturaleDetailsAdmin)
sacher_site.register(Immagine, ImmagineAdmin)
sacher_site.register(Materiale, MaterialeAdmin)
sacher_site.register(Elemento, ElementoAdmin)
sacher_site.register(Modello3d, Modello3dAdmin)
sacher_site.register(LinkElementoMateriale, LinkElementoMaterialeAdmin)
sacher_site.register(UtenteBC, UtenteBCAdmin)
sacher_site.register(Ambito, AmbitoAdmin)
sacher_site.register(Attivita, AttivitaAdmin)
sacher_site.register(Operazione, OperazioneAdmin)
sacher_site.register(File, FileAdmin)
sacher_site.register(Ref3D, Ref3DAdmin)
sacher_site.register(CollegamentoEsterno, CollegamentoEsternoAdmin)
sacher_site.register(SpotColor, SpotColorAdmin)
sacher_site.register(Profile, ProfileAdmin)
sacher_site.register(Categoria, CategoriaAdmin)
