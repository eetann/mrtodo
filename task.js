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
      // this.remind = new Date();
      // this.remind.setSeconds(remind.getSeconds() + 15);
      this.remind = '';
    }
    this.start = '';
    this.end = '';
  }
  /* タスク内容をslackへ投稿 */
  postTask() {
    var msg = {
      "blocks": [
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
    }
    if (this.start != '') {
      // NOTE: メッセージにpushするときはリストに注意
      msg.blocks[1].fields.push({
        "type": "plain_text",
        "text": "開始日:\n" + this.start
      });
    }
    if (this.end != '') {
      // NOTE: メッセージにpushするときはリストに注意
      msg.blocks[1].fields.push({
        "type": "plain_text",
        "text": "終了期限:\n" + this.end
      });
    }
    if (this.remind != '') {
      // NOTE: メッセージにpushするときはリストに注意
      msg.blocks[1].fields.push({
        "type": "plain_text",
        "text": "リマインド:\n" + getyyyyMMddDOWHHmm(this.remind)
      });
    } else {
      msg.blocks[1].fields.push({
        "type": "plain_text",
        "text": "リマインド:\nなし"
      });
    }
    postSlack(msg);
  }
}
