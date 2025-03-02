let images = [];

document.getElementById("imageInput").addEventListener("change", function (event) {
    images = [];
    const files = event.target.files;

    // ファイルをアルファベット部分と数字部分でソート
    const sortedFiles = Array.from(files).sort((a, b) => {
        // ファイル名の前半部分（アルファベット部分）と後半の数字部分でソート
        const aParts = a.name.match(/^([a-zA-Z]+)-(\d+)$/); // アルファベット部分と数字部分を分ける
        const bParts = b.name.match(/^([a-zA-Z]+)-(\d+)$/);

        const aPrefix = aParts ? aParts[1] : ''; // アルファベット部分
        const bPrefix = bParts ? bParts[1] : ''; // アルファベット部分
        const aNumber = aParts ? parseInt(aParts[2]) : 0; // 数字部分
        const bNumber = bParts ? parseInt(bParts[2]) : 0; // 数字部分

        // アルファベット部分（Prefix）が異なる場合、その順番でソート
        if (aPrefix !== bPrefix) {
            return aPrefix.localeCompare(bPrefix); // アルファベット部分で比較
        }

        // 数字部分（aNumber と bNumber）を比較
        return aNumber - bNumber;
    });

    // ソートしたファイルを順番通りに読み込む
    const imagePromises = sortedFiles.map(file => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve(img);  // 読み込み完了時に解決
            img.onerror = reject;  // エラー時に拒否
        });
    });

    // 画像の読み込みが完了してから images 配列に格納
    Promise.all(imagePromises)
        .then(loadedImages => {
            images = loadedImages;
        })
        .catch(error => {
            console.error("画像の読み込みに失敗しました", error);
            alert("画像の読み込みに失敗しました");
        });
});

async function mergeAndDownload() {
    if (images.length === 0) {
        alert('画像を選択してください');
        return;
    }

    const zip = new JSZip();
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // 画像を2枚ずつ結合してZIPに追加
    for (let i = 0; i < images.length; i += 2) {
        const img1 = images[i];
        const img2 = images[i + 1] || null;

        // 横幅1000px、アスペクト比を保った高さ
        const width = 800;
        const height1 = width * (img1.height / img1.width);
        const height2 = img2 ? width * (img2.height / img2.width) : 0;

        // Canvasの高さを計算して設定
        const totalHeight = height1 + height2;
        canvas.width = width;
        canvas.height = totalHeight;

        // 1枚目の画像を描画
        ctx.clearRect(0, 0, width, totalHeight);
        ctx.drawImage(img1, 0, 0, width, height1);

        // 2枚目の画像がある場合は1枚目の下に描画
        if (img2) {
            ctx.drawImage(img2, 0, height1, width, height2);
        }

        // 画像をJPEG形式で取得しZIPに追加
        const dataURL = canvas.toDataURL("image/jpeg");
        const base64Data = dataURL.split(',')[1];
        const fileIndex = Math.floor(i / 2) + 1; // 順番を決定
        zip.file(`merged_image_${fileIndex + 545}.jpg`, base64Data, { base64: true });
    }

    // ZIPファイルを生成してダウンロード
    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "merged_images.zip");
    }).catch(error => {
        console.error("ZIPファイル生成エラー:", error);
        alert("ZIPファイルの生成に失敗しました");
    });
}
