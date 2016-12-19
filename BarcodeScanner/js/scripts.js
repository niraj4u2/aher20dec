(function () {
    'use strict';

    var jq = window.jQuery;
    var guiValuePairs = [
        ['size', 'px'],
        ['minversion', ''],
        ['quiet', ' modules'],
        ['radius', '%'],
        ['msize', '%'],
        ['mposx', '%'],
        ['mposy', '%']
    ];

    function updateGui() {
        jq.each(guiValuePairs, function (idx, pair) {
            var $label = jq('label[for="' + pair[0] + '"]');
            $label.text($label.text().replace(/:.*/, ': ' + jq('#' + pair[0]).val() + pair[1]));
        });
    }

    function updateQrCode() {
		var url =jq('#url').val();
		if (typeof(url) != "undefined"){
			 
		}else{
			return true;
		}
		 var options = {
            render: 'canvas',
            ecLevel: 'H',
            minVersion: parseInt(6, 10),
            fill: '#333333',
            background: '#ffffff',
            text: jq('#url').val(),
            size: parseInt(200, 10),
            radius: parseInt(50, 10) * 0.01,
            quiet: parseInt(1, 10),

            mode: parseInt(2, 10),

            mSize: parseInt(11, 10) * 0.01,
            mPosX: parseInt(50, 10) * 0.01,
            mPosY: parseInt(50, 10) * 0.01,

            label: 'Aher Books',
            fontname: 'Ubuntu',
            fontcolor: '#ff9818',

            image: jq('#img-buffer')[0]
        };

        jq('#container').empty().qrcode(options);
    }

    function update() {
        updateGui();
        updateQrCode();
    }

    function onImageInput() {
        var input = jq('#image')[0];
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (event) {
                jq('#img-buffer').attr('src', event.target.result);
                jq('#mode').val('4');
                setTimeout(update, 250);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function download() {
        jq('#download').attr('href', jq('#container canvas')[0].toDataURL('image/png'));
    }

    function init() {
		 
        jq('#download').on('click', download);
        jq('#image').on('change', onImageInput);
        jq('input, textarea, select').on('input change', update);
        jq(window).load(update);
        update();
    }
	 
    jq(init);
}());
