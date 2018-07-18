from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

from . import views

app_name = 'sacher'
urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='home'),
    # url(r'^login/$', auth_views.login, {'template_name': 'Sacher/login.html'}, name='login'),
    url(r'^login/$', views.login_user, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),

    url(r'^bbcc/$', views.BeneCulturaleList.as_view(), name='bc_list'),
    url(r'^bbcc/(?P<pk>[0-9]+)/$', views.BeneCulturaleDetail.as_view(), name='bc_detail'),
    # url(r'^bbcc/(?P<pk>[0-9]+)/$', views.beneculturale_detail, name='bc_detail'),
    url(r'^bbcc/(?P<pk>[0-9]+)/add_op/$', views.bc_add_operazione, name='bc_add_op'),
    url(r'^bbcc/(?P<pk>[0-9]+)/add_elemento/$', views.bc_add_elemento, name='bc_add_elemento'),
    url(r'^bbcc/update/(?P<pk>[0-9]+)/$', views.BeneCulturaleUpdate.as_view(), name='bc_update'),
    # url(r'^bbcc/delete/(?P<pk>[0-9]+)/$', views.BeneCulturaleDelete.as_view(), name='bc_delete'),
    url(r'^bbcc/delete$', views.bc_delete, name='bc_delete'),
    url(r'^bbcc/create/$', views.BeneCulturaleCreate.as_view(), name='bc_create'),

    url(r'^elementi/(?P<pk>[0-9]+)/$', views.elemento_detail, name='elemento_detail'),
    url(r'^elementi/(?P<pk>[0-9]+)/(?P<anno>[0-9]+)/(?P<mod3d_id>[0-9]+)$', views.elemento_detail, name='elemento_detail_anno'),
    url(r'^elementi/(?P<pk>[0-9]+)/add_op/$', views.elemento_add_operazione, name='elemento_add_op'),
    url(r'^elementi/(?P<pk>[0-9]+)/add_model/$', views.elemento_add_model, name='elemento_add_model'),
    url(r'^elementi/update/(?P<pk>[0-9]+)/$', views.ElementoUpdate.as_view(), name='elemento_update'),
    url(r'^elementi/delete$', views.delete_elemento, name='elemento_delete'),
    url(r'^elementi/create/$', views.ElementoCreate.as_view(), name='elemento_create'),

    url(r'^delete_model/(?P<pk>[0-9]+)$', views.delete_model, name='delete_model'),

    url(r'^operazioni/(?P<pk>[0-9]+)/$', views.operazione_detail, name='operazione_detail'),
    url(r'^operazioni/(?P<pk>[0-9]+)/(?P<anno>[0-9]+)$', views.operazione_detail, name='operazione_detail_anno'),
    url(r'^operazioni/(?P<pk>[0-9]+)/addref3d/$', views.update_3d_refs, name='operazione_add_ref3d'),
    url(r'^operazioni/(?P<pk>[0-9]+)/addfile/$', views.op_add_file, name='operazione_add_file'),
    url(r'^operazioni/(?P<pk>[0-9]+)/add_op_collegata/$', views.op_add_op_collegata, name='operazione_add_op_collegata'),
    url(r'^operazioni/(?P<pk>[0-9]+)/remove_op_collegata/(?P<pk_to_remove>[0-9]+)$', views.op_remove_op_collegata, name='operazione_remove_op_collegata'),
    url(r'^operazioni/(?P<pk>[0-9]+)/add_collegamento_esterno$', views.op_add_collegamento_esterno, name='operazione_add_collegamento_esterno'),
    url(r'^operazioni/(?P<pk>[0-9]+)/update_collegamento_esterno/(?P<ln_pk>[0-9]+)$', views.op_update_collegamento_esterno, name='operazione_update_collegamento_esterno'),
    url(r'^operazioni/update/(?P<pk>[0-9]+)/$', views.operazione_update, name='operazione_update'),
    url(r'^operazioni/delete/(?P<pk>[0-9]+)/$', views.OperazioneDelete.as_view(), name='operazione_delete'),
    url(r'^operazioni/create/$', views.OperazioneCreate.as_view(), name='operazione_create'),

    url(r'^file_edit/(?P<pk>[0-9]+)$', views.file_edit, name='file_edit'),
    url(r'^file_edit/(?P<pk>[0-9]+)/remove_url$', views.file_edit_remove_url, name='file_edit_remove_url'),

    url(r'^ext_link/delete/(?P<pk>[0-9]+)$', views.collegamento_esterno_delete, name='collegamento_esterno_delete'),

    url(r'^file_detail/(?P<pk>[0-9]+)$', views.file_detail, name='file_detail'),
    url(r'^file_detail/(?P<pk>[0-9]+)/delete/$', views.file_delete, name='file_delete'),

    url(r'^range_download/(?P<modello3d_pk>[0-9]+)/(?P<filename>[\w.]+)$', views.range_download, name='range_download'),
    url(r'^thumbnailer/(?P<file_pk>[0-9]+)$', views.thumbnailer, name='thumbnailer'),
    url(r'^get_file_icon/(?P<file_pk>[0-9]+)$', views.get_file_icon, name='get_file_icon'),

    url(r'^gestione_beni/$', views.gestione_beni, name='gestione_beni'),

    url(r'^rest_api/get_ref3d/(?P<pk>[0-9]+)$', views.rest_get_3dref, name='rest_get_ref3d'),
    url(r'^rest_api/delete_ref3d/(?P<pk>[0-9]+)$', views.rest_delete_3dref, name='rest_delete_ref3d'),
    url(r'^rest_api/update_ref3d/(?P<pk>[0-9]+)$', views.rest_update_3dref, name='rest_update_ref3d'),
    url(r'^rest_api/create_ref3d/$', views.rest_create_3dref, name='rest_create_ref3d'),
    url(r'^rest_api/set_home_view/$', views.rest_set_home_view, name='rest_set_home_view'),

    url(r'^ajax/retrieve_op_info/$', views.retrieve_op_info, name='retrieve_op_info'),
    url(r'^ajax/save_op/$', views.save_op, name='save_op'),
    url(r'^ajax/create_bc/$', views.create_bc, name='create_bc'),
    url(r'^ajax/edit_bc/$', views.edit_bc, name='edit_bc'),
    url(r'^ajax/add_element/$', views.add_element, name='add_element'),
    url(r'^ajax/edit_element/$', views.edit_element, name='edit_element'),
    url(r'^ajax/get_element/$', views.get_element, name='get_element'),
    url(r'^ajax/set_perm/$', views.set_perm, name='set_perm'),
    url(r'^ajax/get_subcategory/$', views.get_subcategory, name='get_subcategory'),
    url(r'^ajax/get_ambiti/$', views.get_ambiti, name='get_ambiti'),
    url(r'^ajax/add_model/$', views.add_model, name='add_model'),
    url(r'^ajax/download_op/(?P<pk>[0-9]+)$', views.download_op, name='download_op'),

    url(r'^profile/$', views.profile, name='profile'),
    url(r'^update_profile/$', views.update_profile, name='update_profile'),
    url(r'^projects/$', views.projects, name='projects'),

    url(r'^create_user/$', views.create_user, name='create_user'),
    # url(r'^test/$', views.test, name='test'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
