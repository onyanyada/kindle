

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
                const targetHeight = 1000;
                const aspectRatio = img.width / img.height;
                const targetWidth = targetHeight * aspectRatio;

                // 余白と枠を含むキャンバスサイズを計算
                const margin = 10;
                const borderWidth = 5;
                const canvasWidth = targetWidth + margin * 2 + borderWidth * 2;
                const canvasHeight = targetHeight + margin * 2 + borderWidth * 2;

                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                const ctx = canvas.getContext('2d');

                // 白背景を描画
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 黒枠を描画
                // ctx.fillStyle = '#000000';
                // ctx.fillRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

                // 画像の描画位置を計算して描画（中央に配置）
                const xPos = (canvas.width - targetWidth) / 2;
                const yPos = (canvas.height - targetHeight) / 2;
                ctx.drawImage(img, xPos, yPos, targetWidth, targetHeight);



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
                                a.download = 'm.zip';
                                a.click();
                                URL.revokeObjectURL(url);
                            });
                    }
                }, 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});