from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

class Zapper(models.Model):
    zapper_id = models.TextField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    pnt = models.PointField(geography=True, srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.pnt = Point(self.lng, self.lat)
        super(Zapper, self).save(**kwargs)

class Mosquito(models.Model):
    mosquito_id = models.TextField(primary_key=True)
    zapper_id = models.TextField()
    lat = models.FloatField()
    lng = models.FloatField()
    pnt = models.PointField(geography=True, srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.pnt = Point(self.lng, self.lat)
        super(Mosquito, self).save(**kwargs)

class Trend(models.Model):
    trend_id = models.TextField(primary_key=True)
    zapper_id = models.TextField()
    lat = models.FloatField()
    lng = models.FloatField()
    percentage = models.FloatField()
    up_or_down = models.TextField()
    pnt = models.PointField(geography=True, srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.pnt = Point(self.lng, self.lat)
        super(Mosquito, self).save(**kwargs)

