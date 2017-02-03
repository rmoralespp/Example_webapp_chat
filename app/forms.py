
from .models import Profile,User
from django.forms import ModelForm,Form,CharField,ImageField,TextInput,FileInput,forms


class UserForm(ModelForm):

    def clean_username(self):
        """Comprueba que no exista un username igual en la db"""
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exclude(username=username):
            raise forms.ValidationError('Nombre de usuario ya registrado.')
        return username

    class Meta:
        model=User

        fields=["username" ,"password"]
        widgets={
            'username': TextInput(attrs={'class':"form-control"}),
            'password': TextInput(attrs={'class':"form-control", "type":"password"})
        }





class ProfileForm(ModelForm):
    class Meta:
        model=Profile
        fields=["picture"]


