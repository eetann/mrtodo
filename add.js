/**
 * 送信データからタスクを生成
 * @param {dict} values 送信データ
 * @return {dict} タスクデータ
 */
function generateTask(values) {
  // NOTE: 変数のスコープに注意
  var remind;
  if (values.days) {
    remind = new Date(values.days.day.selected_date.replace(/-/g, '/') + ' '
      + values.hours.hour.selected_option.value + ':'
      + values.minutes.minute.selected_option.value + ':00');
  } else {
    // var remind = new Date();
    // remind.setSeconds(remind.getSeconds() + 15);
    remind = '';
  }
  return {
    'name': values.name.name.value,
    'start': '',
    'end': '',
    'remind': remind
  };
}

/**
 * タスクを追加
 * @return {dict} msg slackのブロック
 */
function addTask(values) {
  var task = generateTask(values);
  // slackに送信
  postSlack(msg4AddedTask(task));
  // スプレッドシートに登録
  if (task.remind != '') {
    var isAdded = addReminder(task);
    if (!isAdded) {
      msgPost('みすった。\n' + task.id);
      return;
    }
  }
  var sheet = getSheetByName('tasks');
  registerTask(sheet, task);
}

/**
 * Date からUNIXタイムスタンプを計算
 * @param {Date} date
 * @return {int} UNIXタイムスタンプ
 */
function convertDate2Epoc(date) {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Slackに送信予約
 * @param {dict} task
 * @return {str} id 取り消す時に必要なid
 */
function addReminder(task) {
  // NOTE: channel にアプリを追加してあげること
  // TODO: ここのtextをボタンにする
  var options = {
    'channel': '#001-todo',
    'post_at': convertDate2Epoc(task.remind),
    'text': task.name
  }
  var res = JSON.parse(callSlackAPI('chat.scheduleMessage', options));
  if (res.ok) {
    task.id = res.scheduled_message_id;
    return true;
  }
  task.id = JSON.stringify(res);
  return false;
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

/**
 * タスク表示ブロックの生成
 */
function msg4AddedTask(task) {
  // TODO: task内容によって表示を分岐
  var msg = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": task.name
        }
      },
      {
        "type": "section",
        "fields": [
        ]
      }
    ]
  }
  if (task.start != '') {
    // NOTE: メッセージにpushするときはリストに注意
    msg.blocks[1].fields.push({
      "type": "plain_text",
      "text": "開始日:\n" + task.start
    });
  }
  if (task.end != '') {
    // NOTE: メッセージにpushするときはリストに注意
    msg.blocks[1].fields.push({
      "type": "plain_text",
      "text": "終了期限:\n" + task.end
    });
  }
  if (task.remind != '') {
    // NOTE: メッセージにpushするときはリストに注意
    msg.blocks[1].fields.push({
      "type": "plain_text",
      "text": "リマインド:\n" + getyyyyMMddDOWHHmm(task.remind)
    });
  } else {
    msg.blocks[1].fields.push({
      "type": "plain_text",
      "text": "リマインド:\nなし"
    });
  }
  return msg;
}

