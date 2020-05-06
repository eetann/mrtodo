/**
 * タスクを追加
 * @return {dict} msg slackのブロック
 */
function addTask(values) {
  var task = new Task(values);
  // slackに送信
  task.postTask();
  // スプレッドシートに登録
  task.addReminder();
  var sheet = getSheetByName('tasks');
  registerTask(sheet, task);
}

/**
 * タスクをシートへ登録
 */
function registerTask(sheet, task) {
  var newRow = sheet.getLastRow() + 1;
  // 無駄な処理は控える
  sheet.getRange(newRow, 1).setValue(task['id']);
  sheet.getRange(newRow, 2).setValue(task['name']);
  sheet.getRange(newRow, 3).setValue(false);
  sheet.getRange(newRow, 4).setValue(task['start']);
  sheet.getRange(newRow, 5).setValue(task['end']);
  sheet.getRange(newRow, 6).setValue(0);
  sheet.getRange(newRow, 7).setValue(task['remind']);
  // TODO: 次の通知(開始日によっては無し)
}
