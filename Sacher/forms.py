from django import forms
from django.core.exceptions import ValidationError

from .models import *
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.utils.html import strip_tags
# from datetime import datetime
import datetime

from HTMLParser import HTMLParser


def nxs_extension_validator(value):
    if not value.name.endswith('.nxs'):
        pass  # raise ValidationError(u'It is possible to upload only .nxs files')
        # TODO aggiungo ply e genera nxs


def setup_initial_vals(class_name, pk, kwargs):
    initial = kwargs.pop('initial', {})
    curr_obj = class_name.objects.get(pk=pk)
    initial_fields = [x.name for x in curr_obj._meta.fields if x.name != 'id']

    for key in initial_fields:
        if hasattr(curr_obj, key):
            initial[key] = initial.get(key) or getattr(curr_obj, key)

    return initial


class AddRef3DForm(forms.Form):
    x = forms.FloatField()
    y = forms.FloatField()
    z = forms.FloatField()
    scale = forms.FloatField()
    nome = forms.CharField(max_length=256)
    descrizione = forms.CharField(widget=forms.Textarea)

    def save(self, op_pk):
        new_ref = Ref3D()
        new_ref.x = self.cleaned_data['x']
        new_ref.y = self.cleaned_data['y']
        new_ref.z = self.cleaned_data['z']
        new_ref.scale = self.cleaned_data['scale']
        new_ref.nome = self.cleaned_data['sigla']
        new_ref.descrizione = self.cleaned_data['descrizione']
        new_ref.operazione_id = op_pk
        new_ref.save()


class AddOperazioneForm(forms.Form):
    date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y', '%d/%m/%Y', '%d/%m/%y']

    altre_op = forms.ModelMultipleChoiceField(queryset=None, required=False)
    elemento = forms.ModelChoiceField(queryset=None)
    responsabile = forms.ModelChoiceField(queryset=None)
    attivita = forms.ModelChoiceField(queryset=None)
    ambito = forms.ModelChoiceField(queryset=None)

    titolo = forms.CharField(max_length=256)
    descrizione = forms.CharField(widget=forms.Textarea)
    tags = forms.CharField(max_length=256)
    today = datetime.datetime.strptime(datetime.date.today().__str__(), '%Y-%m-%d').strftime('%d/%m/%Y')
    data_inizio = forms.DateField(input_formats=date_formats, initial=today)
    # tomorrow = datetime.datetime.strptime((datetime.date.today() + datetime.timedelta(days=1)).__str__(),
    #                                       '%Y-%m-%d').strftime('%d/%m/%Y')
    data_fine = forms.DateField(input_formats=date_formats, initial=today)

    def __init__(self, pk, *args, **kwargs):
        super(AddOperazioneForm, self).__init__(*args, **kwargs)

        self.fields['altre_op'].queryset = Operazione.objects.filter(elemento__bene_culturale_id=pk)
        self.fields['ambito'].queryset = Ambito.objects.filter(progetto_id=pk)
        self.fields['attivita'].queryset = Attivita.objects.filter(progetto_id=pk)
        self.fields['responsabile'].queryset = User.objects.all()
        self.fields['elemento'].queryset = Elemento.objects.filter(bene_culturale_id=pk)

    def clean(self):
        form_data = self.cleaned_data
        if form_data['data_inizio'] > form_data['data_fine']:
            raise ValidationError(_('Error: "Data Fine" deve essere successiva o uguale a "Data Inizio"'))
        return form_data

    def clean_descrizione(self):
        stripped = strip_tags(self.cleaned_data['descrizione'])
        return HTMLParser().unescape(stripped)

    def save_from_bc_page(self, bc_pk, compilatore_id):
        op = Operazione()
        op.ambito = self.cleaned_data['ambito']
        op.attivita = self.cleaned_data['attivita']
        op.compilatore_id = compilatore_id
        op.elemento = self.cleaned_data['elemento']
        op.responsabile = self.cleaned_data['responsabile']
        op.titolo = self.cleaned_data['titolo']
        op.descrizione = self.cleaned_data['descrizione']
        op.tags = self.cleaned_data['tags']
        op.data_inizio = self.cleaned_data["data_inizio"]
        op.data_fine = self.cleaned_data["data_fine"]
        op.save()
        op.altre_op = self.cleaned_data['altre_op']
        op.save()


class UpdateOperazioneForm(AddOperazioneForm):
    def __init__(self, bc_pk, op_pk, *args, **kwargs):
        kwargs['initial'] = setup_initial_vals(Operazione, op_pk, kwargs)

        super(UpdateOperazioneForm, self).__init__(bc_pk, *args, **kwargs)
        self.op_pk = op_pk

    def update_on_db(self):
        op = Operazione.objects.get(pk=self.op_pk)
        op.ambito = self.cleaned_data['ambito']
        op.attivita = self.cleaned_data['attivita']
        op.elemento = self.cleaned_data['elemento']
        op.responsabile = self.cleaned_data['responsabile']
        op.titolo = self.cleaned_data['titolo']
        op.descrizione = self.cleaned_data['descrizione']
        op.tags = self.cleaned_data['tags']
        op.data_inizio = self.cleaned_data["data_inizio"]
        op.data_fine = self.cleaned_data["data_fine"]
        op.altre_op = self.cleaned_data['altre_op']
        op.save()


class AddElementoToBcForm(forms.Form):
    padre = forms.ModelChoiceField(queryset=None, required=False)
    nome = forms.CharField(max_length=256)
    descrizione = forms.CharField(widget=forms.Textarea)

    def __init__(self, bc_pk, *args, **kwargs):
        super(AddElementoToBcForm, self).__init__(*args, **kwargs)

        self.fields['padre'].queryset = Elemento.objects.filter(bene_culturale_id=bc_pk)

    def save(self, bc_pk):
        elem = Elemento()
        elem.bene_culturale_id = bc_pk
        elem.padre = self.cleaned_data['padre']
        elem.nome = self.cleaned_data['nome']
        elem.descrizione = self.cleaned_data['descrizione']
        elem.save()
        return elem


class AddFileToOperazioneForm(forms.Form):
    files = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

    def save_from_elemento_page(self, elemento_pk, compilatore_id):
        op = Operazione()
        op.ambito = self.cleaned_data['ambito']
        op.attivita = self.cleaned_data['attivita']
        op.altre_op = self.cleaned_data['altre_op']
        op.compilatore_id = compilatore_id
        op.elemento_id = elemento_pk
        op.responsabile = self.cleaned_data['responsabile']
        op.titolo = self.cleaned_data['titolo']
        op.descrizione = self.cleaned_data['descrizione']
        op.tags = self.cleaned_data['tags']
        op.data_inizio = self.cleaned_data["data_inizio"]
        op.save()


class AddModelToElementoForm(forms.Form):
    nome = forms.CharField(max_length=256, required=True)
    anno = forms.IntegerField(validators=[MaxValueValidator(datetime.datetime.now().year), MinValueValidator(1800)])
    nxs_file = forms.FileField(allow_empty_file=False, validators=[nxs_extension_validator])


class AddOpCollegataForm(forms.Form):
    altre_op = forms.ModelMultipleChoiceField(queryset=None, required=True)

    def __init__(self, pk, *args, **kwargs):
        super(AddOpCollegataForm, self).__init__(*args, **kwargs)

        curr_op = Operazione.objects.get(pk=pk)
        self.fields['altre_op'].queryset = Operazione.objects.filter(
            modello3d__bene_culturale_id=curr_op.modello3d.bene_culturale_id)

    def save(self, pk):
        curr_op = Operazione.objects.get(pk=pk)
        curr_op.altre_op = self.cleaned_data['altre_op']
        curr_op.save()


class AddCollegamentoEsternoForm(forms.Form):
    nome = forms.CharField(max_length=256, required=False)
    url = forms.URLField(max_length=2048)

    def save(self, op_pk, ln_pk=None):
        ln = CollegamentoEsterno()
        if ln_pk:
            ln.id = ln_pk
        ln.operazione_id = op_pk
        ln.nome = self.cleaned_data['nome']
        ln.url = self.cleaned_data['url']
        ln.save()


class UpdateCollegamentoEsternoForm(AddCollegamentoEsternoForm):
    def __init__(self, ln_id, *args, **kwargs):
        kwargs['initial'] = setup_initial_vals(CollegamentoEsterno, ln_id, kwargs)

        super(UpdateCollegamentoEsternoForm, self).__init__(*args, **kwargs)


class EditFileForm(forms.Form):
    url = forms.URLField(max_length=2048, required=False)
    descrizione = forms.CharField(widget=forms.Textarea, required=False)

    def save(self, pk):
        f = File.objects.get(pk=pk)
        f.url = self.cleaned_data['url']
        f.descrizione = self.cleaned_data['descrizione']
        f.save()


class EditFileWithDataForm(EditFileForm):
    def __init__(self, f_pk, *args, **kwargs):
        kwargs['initial'] = setup_initial_vals(File, f_pk, kwargs)

        super(EditFileForm, self).__init__(*args, **kwargs)

# class ProfileForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['first_name', 'last_name', 'email']
#         # fields = ['avatar', 'website', 'curriculum', 'phone', 'organization']
