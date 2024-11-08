// script.js
$(document).ready(function () {
    $('#file-input').on('change', function (event) {
        const files = event.target.files;
        $('#image-container').empty(); // 既存の画像を削除

        // 各画像ファイルを読み込み、表示用の要素を生成
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = $('<img>').attr('src', e.target.result).addClass('image-frame');
                const wrapper = $('<div>').addClass('image-wrapper').append(img);
                $('#image-container').append(wrapper);
            };
            reader.readAsDataURL(file);
        });
    });

    $('#download-button').on('click', function () {
        html2canvas($('#image-container')[0], { width: 1950, height: 1350 }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'manga.jpg';
            link.click();
        });
    });
});
