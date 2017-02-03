from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify



class Profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    picture=models.ImageField(upload_to="/users_img",blank=True,null=True)
    connected=models.BooleanField(default=False)
    #last_date_conected=models.DateTimeField()


    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()





