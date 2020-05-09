/**
 * yyyy-MM-dd HH mm の3つの文字列からDateデータを生成
 */
function getDateBy3Str(yyyyMMdd, HH, mm) {
  return new Date(yyyyMMdd.replace(/-/g, '/') + ' ' + HH + ':' + mm + ':00');
}

/**
 * モーダルからの入力によってタスクを作る関数
 */
function generateTaskByModalInputs(values) {
  var remind;
  if (values.days) {
    remind = getDateBy3Str(values.days.day.selected_date,
      values.hours.hour.selected_option.value,
      values.minutes.minute.selected_option.value);
  } else {
    remind = '';
  }
  var now = new Date();
  return new Task(now.getTime(), values.name.name.value, remind, '', '');
}

/**
 * タスククラス
 */
class Task {
  constructor(now, name, remind, start, end) {
    this.now = now;
    this.name = name;
    this.remind = remind;
    this.start = start;
    this.end = end;
  }

  /* タスク内容をslackへ投稿 */
  postTask() {
    postSlack('task '
      + this.name, blocks4ShowTask(this.name, this.remind, this.start, this.end));
  }

  /* slackに自作リマインダーを送信予約 */
  addReminder() {
    if (this.remind != '') {
      var res = JSON.parse(scheduleMessage(this.remind, this.name));
      if (res.ok) {
        this.scheduled_message_id = res.scheduled_message_id;
      } else {
        msgPost('みすった。');
        msgPost(JSON.stringify(res));
      }
    }
  }

  /* タスクをシートへ登録 */
  registerTask() {
    var sheet = getSheetByName('tasks');
    var newRow = sheet.getLastRow() + 1;
    // 無駄な処理は控える
    sheet.getRange(newRow, 1).setValue(this.now);
    sheet.getRange(newRow, 2).setValue(this.name);
    sheet.getRange(newRow, 3).setValue(false);
    sheet.getRange(newRow, 4).setValue(this.scheduled_message_id);
    sheet.getRange(newRow, 5).setValue(this.remind);
    sheet.getRange(newRow, 6).setValue(0);
    sheet.getRange(newRow, 7).setValue(this.start);
    sheet.getRange(newRow, 8).setValue(this.end);
    // TODO: 次の通知(開始日によっては無し)
  }
}

/**
 * スプレッドシートからタスク詳細一覧を生成
 */
function generateTaskListBySheet() {
  var sheet = getSheetByName('tasks');
  var LastRow = sheet.getLastRow();
  var tasksArray2 = getSheetValue(sheet, 'A2:H' + LastRow);
  var blocks = [];
  tasksArray2.map(function ([
    now, name, state, scheduled_message_id, remind, repeat, start, end]) {
    blocks.push({"type": "divider"});
    Array.prototype.push.apply(blocks, blocks4ShowTask(name, remind, start, end));
  });
  return blocks;
}
