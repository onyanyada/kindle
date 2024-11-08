// // script.js
// $(document).ready(function () {
//     $('#file-input').on('change', function (event) {
//         const files = event.target.files;
//         $('#image-container').empty(); // 既存の画像を削除

//         // 各画像ファイルを読み込み、表示用の要素を生成
//         Array.from(files).forEach(file => {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 const img = $('<img>').attr('src', e.target.result).addClass('image-frame');
//                 const wrapper = $('<div>').addClass('image-wrapper').append(img);
//                 $('#image-container').append(wrapper);
//             };
//             reader.readAsDataURL(file);
//         });
//     });


//     $('#download-button').on('click', function () {
//         const imageWrappers = $('#image-container .image-wrapper');
//         function downloadImage(index) {
//             if (index >= imageWrappers.length) return; // 全画像の処理が終了したら終了

//             const wrapper = imageWrappers[index];
//             imageWrappers.each(function (index, wrapper) {
//                 html2canvas(wrapper, { width: 1950, height: 1350 }).then(canvas => {
//                     const link = document.createElement('a');
//                     link.href = canvas.toDataURL('image/jpeg');
//                     link.download = `image_${index + 1}.jpg`;
//                     link.click();
//                     // 次の画像のダウンロード処理を少し遅らせて呼び出す
//                     setTimeout(() => downloadImage(index + 1), 500);
//                 });
//             }


//         }
//         downloadImage(0); // 最初の画像からダウンロード開始
//     }

// });

const fileInput = document.getElementById('fileInput');
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', () => {
    const files = fileInput.files;
    if (files.length === 0) {
        alert('ファイルを選択してください。');
        return;
    }
    const convertedImages = [];
    const zip = new JSZip();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const newFileName = file.name.replace('.png', '.jpg');
                    zip.file(newFileName, blob, { base64: true });
                    convertedImages.push(blob);
                    if (convertedImages.length === files.length) {
                        zip.generateAsync({ type: "blob" })
                            .then(function (content) {
                                // ダウンロードリンクの作成
                                const a = document.createElement('a');
                                const url = URL.createObjectURL(content);
                                a.href = url;
                                a.download = 'converted_images.zip';
                                a.click();
                                URL.revokeObjectURL(url);
                            });
                    }
                }, 'image/jpeg');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});