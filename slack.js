/**
 * 日時選択ブロックの生成
 */
function timepicker() {
  // NOTE: options のvalue は文字列(数値だとだめ)
  // TODO: initial_option を工夫する(デフォルト設定や現在時刻など)
  var hours = {
    "type": "static_select",
    "action_id": "hour",
    "placeholder": {
      "type": "plain_text",
      "text": "時間選択"
    },
    "initial_option": {
      "text": {
        "type": "plain_text",
        "text": "0時"
      },
      "value": "0"
    },
    "options": []
  }
  for (var h = 0; h < 24; h++) {
    var opt = {
      "text": {
        "type": "plain_text",
        "text": h + "時"
      },
      "value": String(h)
    }
    hours.options.push(opt);
  }
  var minutes = {
    "type": "static_select",
    "action_id": "minute",
    "placeholder": {
      "type": "plain_text",
      "text": "時間選択"
    },
    "initial_option": {
      "text": {
        "type": "plain_text",
        "text": "0分"
      },
      "value": "0"
    },
    "options": []
  }
  for (var m = 0; m < 60; m += 10) {
    var opt = {
      "text": {
        "type": "plain_text",
        "text": m + "分"
      },
      "value": String(m)
    }
    minutes.options.push(opt);
  }
  // NOTE: ただ送信したいだけならinput type
  // NOTE: 最上位のtypeによってfieldは異なる
  // NOTE: label の text は空だとだめなので空白
  var blocks = [
    {
      "type": "input",
      "block_id": "days",
      "label": {
        "type": "plain_text",
        "text": " ",
        "emoji": true
      },
      "element": {
        "type": "datepicker",
        "action_id": "day",
        "initial_date": Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd"),
        "placeholder": {
          "type": "plain_text",
          "text": "日付"
        }
      }
    },
    {
      "type": "input",
      "block_id": "hours",
      "label": {
        "type": "plain_text",
        "text": " ",
        "emoji": true
      },
      "element": hours
    },
    {
      "type": "input",
      "block_id": "minutes",
      "label": {
        "type": "plain_text",
        "text": " ",
        "emoji": true
      },
      "element": minutes
    }
  ]
  return blocks;
}

/**
 * slackにメッセージを送る関数
 * @param {dict} msg jsonに対応する連想配列
 *     https://api.slack.com/tools/block-kit-builder で作ると良い
 */
function postSlack(msg) {
  // TODO: ここを chat.postMessage などに置き換える
  // NOTE: スクリプトのプロパティはdebugではなくmainのみでOK
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(msg)
  };
  return UrlFetchApp.fetch(getScriptProperty('URL'), options);
}

/**
 * slackにモーダルを表示させる
 * NOTE: Interactivity をオンにして Request URL を設定すること
 * @param {str} trigger_id
 * @param {dict} viewDict
 */
function openView(trigger_id, viewDict) {
  var options = {
    'trigger_id': trigger_id,
    'view': viewDict
  }
  return callSlackAPI('views.open', options);
}

/**
 * slackのモーダルを更新
 * @param {str} view_id
 * @param {dict} viewDict
 */
function updateView(view_id, viewDict) {
  var options = {
    'view_id': view_id,
    'view': viewDict
  }
  return callSlackAPI('views.update', options);
}

/**
 * slackのAPIを呼ぶ
 * @param {str} api apiのurl chat.scheduleMessage とか
 * @param {dict} msg jsonに対応する連想配列
 */
function callSlackAPI(api, msg) {
  var options = {
    "method": "post",
    'headers': {
      "Authorization":
        "Bearer " + getScriptProperty('TOKEN')
    },
    "contentType": "application/json",
    "payload": JSON.stringify(msg)
  };
  return UrlFetchApp.fetch("https://slack.com/api/" + api, options);
}

/**
 * 空白文字列で区切られている引数を配列へ
 */
function text2params(e) {
  // 連続する空白を1つへ 全角も含む
  var paramStr = e.parameter.text.replace(/[\s　]+/g, " ");
  // 空白で区切って配列へ
  return paramStr.trim().split(" ");
}

/**
 * 日本語で曜日を返す
 */
function getDayOfWeek(day) {
  var dayOfWeek = day.getDay();
  return ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];
}
/**
 * yyyy/MM/dd (DOW) HH:mm を返す
 */
function getyyyyMMddDOWHHmm(date) {
  return Utilities.formatDate(date, 'Asia/Tokyo',
    `yyyy/MM/dd (${getDayOfWeek(date)}) HH:mm`);

}

/**
 * slackに単純にメッセージを送信
 * @param {str} text 送信したい文字列
 */
function msgPost(text) {
  return postSlack({
    'blocks': [
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': text
        }
      },
    ]
  });
}

/**
 * Slackに送信予約
 * @param {int} time 秒
 * @param {str} text
 * @return {JSON} レスポンス
 */
function scheduleMessage(time, text) {
  // NOTE: channel にアプリを追加してあげること
  // TODO: ここのtextをblocksにする
  return callSlackAPI('chat.scheduleMessage', {
    'channel': getScriptProperty('channnelName'),
    'post_at': convertDate2Epoc(time),
    'text': text
  });
}

