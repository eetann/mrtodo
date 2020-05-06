/**
 * タスククラス
 */
function Task(values) {
  /* プロパティの整理 */
  this.name = values.name.name.value;
  // remind を設定
  // NOTE: 変数のスコープに注意
  this.remind;
  Task.prototype.setRemind = function () {
    if (values.days) {
      this.remind = new Date(values.days.day.selected_date.replace(/-/g, '/') + ' '
        + values.hours.hour.selected_option.value + ':'
        + values.minutes.minute.selected_option.value + ':00');
    } else {
      // this.remind = new Date();
      // this.remind.setSeconds(remind.getSeconds() + 15);
      this.remind = '';
    }
  }
  this.setRemind();
  this.start = '';
  this.end = '';

  /* タスク内容をslackへ投稿 */
  Task.prototype.postTask = function () {
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
