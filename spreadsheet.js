/**
 * このソースと対応するシートを返す
 */
function getSheetActive() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getActiveSheet();
}

/** 
 * シート名からシートを取得
 */
function getSheetByName(sheetName) {
  // TODO: try catch
  // NOTE: debugを別プロジェクトにするなら activeは使えない
  // return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return SpreadsheetApp.openById(getScriptProperty('SHEETID')).getSheetByName(sheetName);
}

/**
 * 範囲からシートの値を二次元配列で返す
 */
function getSheetValue(sheet, rangeStr) {
  return sheet.getRange(rangeStr).getValues();
}

/**
 * 2次元配列の0要素をキー、1要素を値にする辞書を生成
 */
function convertRows2Dict(row) {
  return row.reduce((obj, [key, value]) => Object.assign(obj, {[key]: value}), {});
}

/**
 * 列名を列番号に変換
 * @param {str} colName 列名
 * @return {int} 列番号
 */
function getColNumByName(sheet, colName) {
  // 列番号は1から始まる
  return sheet.getRange("1:1").getValues()[0].indexOf(colName) + 1;
}

/**
 * sheet settings から設定を読み取る
 * @return {dict} settings 設定
 */
function getSettings() {
  var sheet = getSheetByName('settings');
  var settingsArray = getSheetValue(sheet, 'A2:B' + sheet.getLastRow());
  return convertRows2Dict(settingsArray);
}
