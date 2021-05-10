from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import UserChangeForm
from .models import User
from django import forms
# Register your models here.

class UserChangeFormExtended(UserChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['code'] = forms.CharField(label=_("Code"), max_length=10)

UserAdmin.form = UserChangeFormExtended
UserAdmin.fieldsets = (
        (None, {'fields': ('username', 'password', 'code')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
admin.site.register(User, UserAdmin)