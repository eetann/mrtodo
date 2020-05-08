/**
 * yyyy-MM-dd HH mm の3つの文字列からDateデータを生成
 */
function getDateBy3Str(yyyyMMdd, HH, mm) {
  return new Date(yyyyMMdd.replace(/-/g, '/') + ' ' + HH + ':' + mm + ':00');
}

/**
 * タスククラス
 */
class Task {
  constructor(values) {
    this.name = values.name.name.value;
    // remind を設定
    if (values.days) {
      this.remind = getDateBy3Str(values.days.day.selected_date,
        values.hours.hour.selected_option.value,
        values.minutes.minute.selected_option.value);
    } else {
      this.remind = '';
    }
    this.start = '';
    this.end = '';
  }

  /* タスク内容をslackへ投稿 */
  postTask() {
    var blocks = [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": this.name
        }
      },
      {
        "type": "section",
        "fields": [
        ]
      }
    ]

    if (this.start != '') {
      // NOTE: メッセージにpushするときはリストに注意
      blocks[1].fields.push({
        "type": "plain_text",
        "text": "開始日:\n" + this.start
      });
    }
    if (this.end != '') {
      // NOTE: メッセージにpushするときはリストに注意
      blocks[1].fields.push({
        "type": "plain_text",
        "text": "終了期限:\n" + this.end
      });
    }
    if (this.remind != '') {
      // NOTE: メッセージにpushするときはリストに注意
      blocks[1].fields.push({
        "type": "plain_text",
        "text": "リマインド:\n" + getyyyyMMddDOWHHmm(this.remind)
      });
    } else {
      blocks[1].fields.push({
        "type": "plain_text",
        "text": "リマインド:\nなし"
      });
    }
    postSlack('task ' + this.name, blocks);
  }

  /* slackに自作リマインダーを送信予約 */
  addReminder() {
    if (this.remind != '') {
      var res = JSON.parse(scheduleMessage(this.remind, this.name));
      if (res.ok) {
        this.id = res.scheduled_message_id;
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
    sheet.getRange(newRow, 1).setValue(this.id);
    sheet.getRange(newRow, 2).setValue(this.name);
    sheet.getRange(newRow, 3).setValue(false);
    sheet.getRange(newRow, 4).setValue(this.start);
    sheet.getRange(newRow, 5).setValue(this.end);
    sheet.getRange(newRow, 6).setValue(0);
    sheet.getRange(newRow, 7).setValue(this.remind);
    // TODO: 次の通知(開始日によっては無し)
  }
}
