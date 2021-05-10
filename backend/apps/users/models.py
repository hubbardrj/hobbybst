# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
import shortuuid

class User(AbstractUser):
    code = models.CharField(max_length=20, default='', null=False)
    pass