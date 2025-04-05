function testDummyPost() {
  const url = 'https://jsonplaceholder.typicode.com/posts';

  const payload = JSON.stringify({
    title: 'テストタイトル',
    body: 'これはGASから送ったテスト投稿です。',
    userId: 123
  });

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = response.getContentText();
    Logger.log('レスポンスコード: ' + response.getResponseCode());
    Logger.log('レスポンス内容: ' + result);
  } catch (e) {
    Logger.log('エラーが発生しました: ' + e.message);
  }
}