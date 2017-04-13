from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

class Event(models.Model):
    event_id = models.TextField(primary_key=True)
    left_lng = models.FloatField()
    right_lng = models.FloatField()
    top_lat = models.FloatField()
    down_lat = models.FloatField()
    pnts = ArrayField(
        models.PointField(geography=True, srid=4326)
    )
