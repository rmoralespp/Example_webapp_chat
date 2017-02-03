
from django.conf.urls import url,include
from .views import index,login_view,logout_view

urlpatterns = [
    url(r'^$',index),
    url(r'^login$', login_view, name="login"),
    url(r'^home$', 'app.views.home', name='home'),
    url(r'^profile', 'app.views.profile', name='profile'),
    url(r'^logout$', logout_view, name="logout"),


]
