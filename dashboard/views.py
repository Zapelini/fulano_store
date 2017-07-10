from django.shortcuts import render

# Create your views here.


def home_page(request):
    return render(request, 'dashboard/home.html')


def preco_view(request):
    return render(request, 'dashboard/preco.html')


def contato_view(request):
    return render(request, 'dashboard/contato.html')


def sobre_view(request):
    return render(request, 'dashboard/sobre.html')
