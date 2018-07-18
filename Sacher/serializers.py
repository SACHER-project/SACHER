from rest_framework import serializers

from Sacher.models import Ref3D, Elemento


class Ref3dSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ref3D
        fields = '__all__'

    def create(self, validated_data):
        return Ref3D.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.descrizione = validated_data.get('descrizione', instance.descrizione)
        instance.nome = validated_data.get('nome', instance.nome)
        instance.scale = validated_data.get('scale', instance.scale)
        # instance.colore = validated_data.get('colore', instance.colore)
        instance.save()
        return instance


class ElementoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elemento
        fields = '__all__'
