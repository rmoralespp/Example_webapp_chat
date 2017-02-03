from django.shortcuts import render,redirect,Http404,HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages

from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import get_object_or_404, render, redirect
from django.template import RequestContext
from django.contrib.auth.models import User
import json
from django.http import JsonResponse
from django.core import serializers
from .models import Profile,User
from .forms import ProfileForm,UserForm

from .models import Profile
def index(request):
    return render(request,'index.html')


def home(request):
    users=User.objects.all().exclude(id=request.user.id)
    context={'users':users}
    return render(request,'home.html',context)


def profile(request):
    if request.method == 'POST':
        user_form=UserForm(request.POST)
        profile_form=ProfileForm(request.POST,request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile=profile_form.save(commit=False)
            profile.user=user_form
            profile_form.save()
            messages.add_message(request, messages.SUCCESS, "Your user account has been successfully created")
            return redirect('/')
    else:
        user_form=UserForm()
        profile_form=ProfileForm()
    context={'profile_form':profile_form,'user_form':user_form}
    return render(request,'profile.html',context)


def login_view(request):
    data={'url':"/",'user':"None"}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user=authenticate(username=username, password=password)

        if user is not None:
            profile=Profile.objects.get(user__id=user.id)
            profile.connected=True
            profile.save()
            login(request,user)
            data['url']="/home"
            data['user']={'id':user.id,'username':user.username}
        else:
            messages.add_message(request, messages.ERROR, "Your credentials are invalid")
    return JsonResponse(data)




@login_required()
def logout_view(request):
    profile=Profile.objects.get(user__id=request.user.id)
    profile.connected=False
    profile.save()
    data={'url':"/",'user':{'id':profile.user.id,'username':profile.user.username}}
    logout(request)
    return JsonResponse(data)


