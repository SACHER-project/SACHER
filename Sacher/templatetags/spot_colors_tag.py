from django import template
from ..models import SpotColor

register = template.Library()


@register.simple_tag(takes_context=True)
def add_spot_colors_to_context(context):
    colors = SpotColor.objects.all()
    context['spot_colors_all'] = colors
    return ''
