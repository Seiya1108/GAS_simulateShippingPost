function simulateShippingPost() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const url = 'https://jsonplaceholder.typicode.com/posts';
  const now = new Date(); // 現在日時

  for (let i = 1; i < data.length; i++) {
    const orderNumber = data[i][0];
    const deliveryCode = data[i][1];
    const trackingNumber = data[i][2];
    const shippingDate = data[i][3];
    const currentStatus = data[i][4]; // E列: ステータス

    // ✅ 送信済みはスキップ
    if (currentStatus === '送信成功') {
      Logger.log(`スキップ: ${i + 1}行目はすでに送信済み`);
      continue;
    }

    if (!orderNumber || !deliveryCode || !trackingNumber || !shippingDate) {
      writeLog(sheet, i, '送信失敗', '入力値に空があります', now);
      continue;
    }

    const payload = JSON.stringify({
      orderNumber: orderNumber,
      deliveryServiceId: deliveryCode,
      trackingNumber: trackingNumber,
      shippingDate: shippingDate
    });

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: payload,
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();

      if (responseCode === 201) {
        writeLog(sheet, i, '送信成功', 'OK', now);
      } else {
        writeLog(sheet, i, '送信失敗', `レスポンスコード: ${responseCode}`, now);
      }

    } catch (e) {
      writeLog(sheet, i, '送信失敗', `エラー: ${e.message}`, now);
    }
  }
}

// G列にも送信日時を書き込むように拡張！
function writeLog(sheet, rowIndex, status, message, date) {
  sheet.getRange(rowIndex + 1, 5).setValue(status); // E列: ステータス
  sheet.getRange(rowIndex + 1, 6).setValue(message); // F列: メッセージ

  const formatted = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  sheet.getRange(rowIndex + 1, 7).setValue(formatted); // G列: 送信日時
}