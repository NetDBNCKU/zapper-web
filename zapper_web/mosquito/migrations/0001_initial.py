# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-13 06:34
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mosquito',
            fields=[
                ('mosquito_id', models.TextField(primary_key=True, serialize=False)),
                ('zapper_id', models.TextField()),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
                ('pnt', django.contrib.gis.db.models.fields.PointField(geography=True, srid=4326)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Trend',
            fields=[
                ('trend_id', models.TextField(primary_key=True, serialize=False)),
                ('zapper_id', models.TextField()),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
                ('percentage', models.FloatField()),
                ('up_or_down', models.TextField()),
                ('pnt', django.contrib.gis.db.models.fields.PointField(geography=True, srid=4326)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Zapper',
            fields=[
                ('zapper_id', models.TextField(primary_key=True, serialize=False)),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
                ('pnt', django.contrib.gis.db.models.fields.PointField(geography=True, srid=4326)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
