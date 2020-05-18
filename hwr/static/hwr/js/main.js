var Cropper = window.Cropper;
var container = document.querySelector('.img-container');
var image = container.getElementsByTagName('img').item(0);

var currentAnnotation_id = -1;

var img_shape = document.getElementById('img_shape');
var crop_shape = document.getElementById('crop_shape');
var ann_box = document.getElementById('annotation_box');

var crop_W = -1;
var crop_H = -1;
var crop_X = -1;
var crop_Y = -1;

var ann_box_onfocus = false;

var options = {
    aspectRatio: 0,
    viewMode: 2,
    guides: 0,
    highlight: 0,

    crop: function (e) {
        var data = e.detail;
        var imgdata = cropper.getImageData();
        img_shape.textContent = '\xa0' + imgdata.naturalWidth + 'x' + imgdata.naturalHeight + '\xa0' + '\xa0';
        crop_shape.textContent = '\xa0' + Math.round(data.width) + 'x' + Math.round(data.height) + '\xa0' + "at x" + '\xa0' + Math.round(data.x) + '\xa0 y' + '\xa0' + Math.round(data.y);
        crop_X = Math.round(data.x);
        crop_Y = Math.round(data.y);
        crop_W = Math.round(data.width);
        crop_H = Math.round(data.height)

    },

    cropstart: function (e) {
        ann_box.blur();
    },

    ready: function (e) {
         if (ANNOTATIONS.length > 0) {
        setCropperValues(ANNOTATIONS.length - 1);
        resetAnnotation(ANNOTATIONS.length - 1);
    }
    }
};

var cropper = new Cropper(image, options);

function resetAnnotation(btn_id) {

currentAnnotation_id = -1;
ann_box.value = "";
document.getElementById(btn_id).blur();
}

function setCropperValues(anno_id) {
    var currentAnnotation = ANNOTATIONS[anno_id];
    currentAnnotation_id = currentAnnotation.id;

    cropper.setCanvasData(JSON.parse(currentAnnotation["canvasData"]));
    cropper.setCropBoxData(JSON.parse(currentAnnotation["cropBoxData"]));
    ann_box.value = currentAnnotation["annotazione"]

}

ann_box.onfocus = function () {
    ann_box_onfocus = true;
};
ann_box.onfocusout = function () {
    ann_box_onfocus = false;
};

document.onkeydown = function (event) {
    var k = event.keyCode;

    if (ann_box_onfocus === false) {
        if (k === 39) {
            cropper.move(-10, 0);
        } else if (k === 40) {
            cropper.move(0, -10);
        } else if (k === 37) {
            cropper.move(10, 0);
        } else if (k === 38) {
            cropper.move(0, 10);
        }
    }
};


$("#btn_save").click(function () {
    var cropBoxData = JSON.stringify(cropper.getCropBoxData());
    var canvasData = JSON.stringify(cropper.getCanvasData());
    var cropData = JSON.stringify({"x": crop_X, "y": crop_Y, "w": crop_W, "h": crop_H})

    if ((crop_X === -1) || (crop_Y === -1) || (crop_H === -1) || (crop_W === -1) || (ann_box.value.length === 0)) {
        alert("Empty annotation or invalid crop selection");
    } else {
        var form = document.createElement("form");
        form.method = "post";
        form.action = "/hwr/annota/";

        var cropData_input = document.createElement("input");
        cropData_input.name = "cropData";
        cropData_input.value = cropData;
        form.appendChild(cropData_input);
        var page_id_input = document.createElement("input");
        page_id_input.name = "page_id";
        page_id_input.value = PAGE_ID;
        form.appendChild(page_id_input);
        var opera_input = document.createElement("input");
        opera_input.name = "opera_id";
        opera_input.value = OPERA_ID;
        form.appendChild(opera_input);
        var anno_id_input = document.createElement("input");
        anno_id_input.name = "anno_id";
        anno_id_input.value = currentAnnotation_id;
        form.appendChild(anno_id_input);
        var annotation_input = document.createElement("input");
        annotation_input.name = "annotation";
        annotation_input.value = ann_box.value;
        form.appendChild(annotation_input);
        var canvasData_input = document.createElement("input");
        canvasData_input.name = "canvasData";
        canvasData_input.value = canvasData;
        form.appendChild(canvasData_input);
        var cropBoxData_input = document.createElement("input");
        cropBoxData_input.name = "cropBoxData";
        cropBoxData_input.value = cropBoxData;
        form.appendChild(cropBoxData_input);
        var save_input = document.createElement("input");
        save_input.name = "save";
        save_input.value = true;
        form.appendChild(save_input);
        var csrfmiddlewaretoken = document.createElement("input");
        csrfmiddlewaretoken.type = 'hidden';
        csrfmiddlewaretoken.value = CSRF_TOKEN;
        csrfmiddlewaretoken.name = "csrfmiddlewaretoken";
        form.appendChild(csrfmiddlewaretoken);

        document.body.appendChild(form);

        form.submit();

    }
});


$("#btn_next_page").click(function () {

    var form = document.createElement("form");
        form.method = "post";
        form.action = "/hwr/annota/";
        var save_input = document.createElement("input");
        save_input.name = "gnp";
        save_input.value = true;
        form.appendChild(save_input);
        var page_id_input = document.createElement("input");
        page_id_input.name = "page_id";
        page_id_input.value = PAGE_ID;
        form.appendChild(page_id_input);
        var opera_input = document.createElement("input");
        opera_input.name = "opera_id";
        opera_input.value = OPERA_ID;
        form.appendChild(opera_input);
        var csrfmiddlewaretoken = document.createElement("input");
        csrfmiddlewaretoken.type = 'hidden';
        csrfmiddlewaretoken.value = CSRF_TOKEN;
        csrfmiddlewaretoken.name = "csrfmiddlewaretoken";
        form.appendChild(csrfmiddlewaretoken);

        document.body.appendChild(form);

        form.submit();

});



