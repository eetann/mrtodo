/**
 * スクリプトのプロパティを取得
 */
function getScriptProperty(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

/**
 * Date からUNIXタイムスタンプを計算
 * @param {Date} date
 * @return {int} UNIXタイムスタンプ
 */
function convertDate2Epoc(date) {
  return Math.floor(date.getTime() / 1000);
}

