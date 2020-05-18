from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from hwr.models import Pagina, Annotazione, Autore, Opera

@login_required
def annota(request):

    if request.method == "POST":
        end_pages = False

        data = request.POST
        template_name = 'hwr/index.html'
        context = {}

        page_id = data['page_id']
        opera_id = data['opera_id']

        current_page = Pagina.objects.get(id=page_id, opera=opera_id)

        if "save" in request.POST:
            if Annotazione.objects.filter(pk=data["anno_id"]).exists():
                anno = Annotazione.objects.get(id=data["anno_id"])
                anno.cropData = data['cropData']
                anno.cropBoxData = data['cropBoxData']
                anno.canvasData = data['canvasData']
                anno.annotazione = data['annotation']
                anno.opera_id = data['opera_id']
                anno.page_id = data['page_id']
                anno.save()
            else:
                Annotazione(cropData=data['cropData'], cropBoxData=data['cropBoxData'], canvasData=data['canvasData'],
                            annotazione=data['annotation'], opera_id=data['opera_id'], page_id=data['page_id'],
                            ).save()
        elif "gnp" in request.POST:
            current_page.done = True
            current_page.save()
            if Pagina.objects.filter(pagina_nr__exact=current_page.pagina_nr+1, opera=data["opera_id"]).exists():
                current_page = Pagina.objects.get(pagina_nr__exact=current_page.pagina_nr+1, opera=data["opera_id"])
                page_id = current_page.id
            else:
                end_pages = True

        if not end_pages:
            query = list(Annotazione.objects.filter(page_id=page_id, opera_id=opera_id).values())

            context["page"] = current_page
            context["annotations"] = query
        else:
            context = {}
            template_name = 'hwr/empty.html'

        return render(request, template_name, context)

@login_required
def index(request):
    context = {}
    template_name = 'hwr/opere.html'
    artisti = Autore.objects.all()
    opere = Opera.objects.all()
    pagine = []
    selectedOpera = -1

    if len(artisti) == 0:
        context = {}
        template_name = 'hwr/empty.html'

    if "opera_id" in request.GET and request.GET['opera_id'] != "":
        pagine = Pagina.objects.filter(opera=request.GET['opera_id'])
        selectedOpera = request.GET['opera_id']

    ncols = 5
    rows = []
    for i in range(0,len(pagine), ncols):
        rows.append(pagine[i:i+ncols])

    context["artisti"] = artisti
    context["opere"] = opere
    context["pagine"] = rows
    context["selectedOpera"] = selectedOpera

    return render(request, template_name, context)
