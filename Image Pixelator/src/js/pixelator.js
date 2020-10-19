window.addEventListener('load', function() {
    const pixelateButton = document.querySelector('.btn__pixelate');
    const downloadButton = document.getElementById('download');
    
    const factorValue = document.querySelector('.factor__range');
    const factorOutput = document.querySelector('.factor__output');

    factorOutput.innerHTML = `${factorValue.value}%`;

    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const src = URL.createObjectURL(this.files[0]);
            const img = document.getElementById('img--original');
            const pixelated = document.getElementById('img--pixelated');

            if (pixelated.src !== '#') {
                pixelated.src = '#';
                downloadButton.setAttribute('download', `pixelated_${this.files[0].name}`);
                downloadButton.classList.add('flex__item--hidden');
            }

            img.src = src;

            if (document.querySelector('.grid__item--hidden')) {
                document.querySelector('.grid__item--hidden').classList.remove('grid__item--hidden');
            }
        }
    });

    pixelateButton.addEventListener('click', pixelate);
    factorValue.addEventListener('input', function() {
        factorOutput.innerHTML = `${this.value}%`;
    })
});

/**
 * Get value from factor range as a percentage.
 */
function getPixelationFactor() {
    const factor = document.querySelector('.factor__range').value / 100;
    return factor;
}

function pixelate() { 
    if (!document.getElementById('img--original')) return;

    var ctx = document.getElementById('canvas').getContext('2d');
    const src = document.getElementById('img--original').src;
    const size = getPixelationFactor() * 100; // TODO: get value from input

    const img = new Image();
    img.src = src;

    img.onload = function() {
        const downloadButton = document.getElementById('download');

        // get canvas width and height
        const height = Math.ceil(img.height / size) * size;
        const width = Math.ceil(img.width / size) * size;
        const small = { height: height / size, width: width / size };

        // set canvas width and height
        var canvas = ctx.canvas;
        canvas.width = width;
        canvas.height = height;

        // pixelate image
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, small.width, small.height);
        ctx.rect(0, 0, width, height);
        ctx.drawImage(canvas, 0, 0, small.width, small.height, 0, 0, width, height);

        // display new image and clear canvas
        const url = canvas.toDataURL();
        document.getElementById('img--pixelated').setAttribute('src', url);
        downloadButton.setAttribute('href', url);
        downloadButton.classList.remove('flex__item--hidden');
        ctx.clearRect(0, 0, width, height);
        canvas.width = 0;
        canvas.height = 0;
    }

}