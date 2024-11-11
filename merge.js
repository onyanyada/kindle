let images = [];

document.getElementById("imageInput").addEventListener("change", function (event) {
    images = [];
    const files = event.target.files;
    const preview = document.getElementById("preview");
    preview.innerHTML = "";

    Array.from(files).forEach(file => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            images.push(img);
            preview.appendChild(img);
        };
    });
});

function mergeAndDownload() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < images.length; i += 2) {
        const img1 = images[i];
        const img2 = images[i + 1] || null;

        // 画像の横幅を1000pxに固定し、高さはアスペクト比を保つ
        const width = 1000;
        const height1 = width * (img1.height / img1.width);
        const height2 = img2 ? width * (img2.height / img2.width) : 0;

        // Canvasの高さを計算して設定
        const totalHeight = height1 + height2;
        canvas.width = width;
        canvas.height = totalHeight;

        // 1枚目の画像を描画
        ctx.drawImage(img1, 0, 0, width, height1);

        // 2枚目の画像がある場合は1枚目の下に描画
        if (img2) {
            ctx.drawImage(img2, 0, height1, width, height2);
        }


        // 画像をJPEG形式でダウンロード
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg");
        link.download = `merged_image_${Math.floor(i / 2) + 1}.jpg`;
        link.click();
    }
}