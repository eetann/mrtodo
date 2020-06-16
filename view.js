/**
 * タスク追加モーダルの生成
 */
function view4AddTaskCommon() {
  var view = {
    "type": "modal",
    "callback_id": "add_task_submit",
    "title": {
      "type": "plain_text",
      "text": "タスクの追加",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": []
  }
  view.blocks.push({
    "type": "input",
    "block_id": "name",
    "element": {
      "type": "plain_text_input",
      "action_id": "name"
    },
    "label": {
      "type": "plain_text",
      "text": "タスク名",
      "emoji": true
    }
  })
  view.blocks.push({"type": "divider"})
  return view;
}

/**
 * タスクの追加ビュー 初期ビューを生成
 */
function generateView4AddTaskInit() {
  var view = view4AddTaskCommon();
  view.blocks.push({
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "リマインダー"
    },
    "accessory": {
      "type": "button",
      "action_id": "add_remind",
      "text": {
        "type": "plain_text",
        "text": "追加",
        "emoji": true
      },
      "value": "add_remind"
    }
  })
  return view;
}

/**
 * タスクの追加ビュー 初期ビューを開く
 * @param {str} trigger_id
 */
function openView4AddTaskInit(trigger_id) {
  openView(trigger_id, generateView4AddTaskInit());
}

/**
 * タスクの追加ビュー リマインド有りに更新
 * @param {str} view_id
 */
function updateView4AddTaskRemind(view_id) {
  var view = view4AddTaskCommon();
  // TODO: リマインド削除ボタンの実装
  view.blocks.push({"type": "divider"})
  view.blocks.push({
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "リマインダー"
    },
    "accessory": {
      "type": "button",
      "action_id": "delete_remind",
      "text": {
        "type": "plain_text",
        "text": "削除",
        "emoji": true
      },
      "value": "delete_remind"
    }
  })
  Array.prototype.push.apply(view.blocks, timepicker());
  updateView(view_id, view);
}

/**
 * タスクの追加ビュー リマインド削除して更新
 * @param {str} view_id
 */
function updateView4DeleteTaskRemind(view_id) {
  // TODO: 先のビューによって分岐させる
  updateView(view_id, generateView4AddTaskInit());
}

/**
 * スプレッドシートからタスク詳細一覧を生成
 * @param {dict} blocks 優先リストとタスク詳細一覧
 */
function generateTaskListsBySheet() {
  var sheet = getSheetByName('tasks');
  var LastRow = sheet.getLastRow();
  var tasksArray2 = getSheetValue(sheet, 'A2:H' + LastRow);
  var options = [];
  var initial_options = [];
  var tasks = [];
  tasksArray2.map(function ([
    now, name, state, scheduled_message_id, remind, order, start, end]) {
    if (order > 0) {
      var text;
      if (state) {
        text = '~' + name + '~';
        initial_options.push({
          "text": {
            "type": "mrkdwn",
            "text": text
          },
          "value": 'done ' + now
        });
      } else {
        text = name;
      }
      options.push([order,
        {
          "text": {
            "type": "mrkdwn",
            "text": text
          },
          "value": 'done ' + now
        }]);
    }
    tasks.push({"type": "divider"});
    Array.prototype.push.apply(tasks, blocks4ShowTask(now, name, remind, start, end));
  });
  var blocks = [];
  if (options.length > 0) {
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Today*"
      }
    });
    // 優先度を昇順で並び替え
    options.sort(function (a, b) {
      return a[0] - b[0];
    });
    var checkboxes = {
      "type": "actions",
      "elements": [
        {
          "type": "checkboxes",
          "action_id": "done checkboxes",
          "options": options.map(function (t) {return t[1];})
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Edit",
            "emoji": true
          },
          "style": "primary"
        }
      ]
    };
    if (initial_options.length > 0) {
      checkboxes.elements[0]["initial_options"] = initial_options;
    }
    blocks.push(checkboxes);
  }
  if (tasks.length > 0) {
    blocks.push({
      "type": "divider"
    });
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "タスク一覧"
      }
    });
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "1 ~ 10 / 200 を表示"
      },
      "accessory": {
        "type": "overflow",
        "options": [
          {
            "text": {
              "type": "plain_text",
              "text": "Option 1",
              "emoji": true
            },
            "value": "value-0"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Option 4",
              "emoji": true
            },
            "value": "value-3"
          }
        ]
      }
    });
    Array.prototype.push.apply(blocks, tasks);
  }
  return blocks;
}

/**
 * Homeビュー
 */
function generateView4Home() {
  var view = {
    "type": "home",
    "blocks": [
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "New Task",
              "emoji": true
            },
            "style": "primary",
            "value": "create_task"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "help",
              "emoji": true
            },
            "value": "help"
          }
        ]
      }
    ]
  }
  var blocks = generateTaskListsBySheet();
  Array.prototype.push.apply(view.blocks, blocks);
  return view;
}

/**
 * Homeの初期ビューを送信
 */
function publishView4HomeInit(user_id) {
  var view = generateView4Home();
  publishView(user_id, view);
}

/**
 * タスクを表示するためのブロックを返す
 */
function blocks4ShowTask(now, name, remind, start, end) {
  // TODO: ここの時点でボタンにvalueを設定
  var blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": '>*' + name + '*'
      },
      "accessory": {
        "type": "button",
        "action_id": "done " + now,
        "text": {
          "type": "plain_text",
          "text": "完了",
          "emoji": true
        },
        "style": "primary",
        "value": "done"
      }
    },
    {
      "type": "section",
      "fields": [
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "削除"
          },
          "style": "danger",
          "value": "click_me_123"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "編集"
          },
          "style": "primary",
          "value": "click_me_123"
        }
      ]
    }
  ]

  if (start != '') {
    // NOTE: メッセージにpushするときはリストに注意
    blocks[1].fields.push({
      "type": "mrkdwn",
      "text": "*開始日*:\n" + start
    });
  }
  if (end != '') {
    // NOTE: メッセージにpushするときはリストに注意
    blocks[1].fields.push({
      "type": "mrkdwn",
      "text": "*終了期限*:\n" + end
    });
  }
  if (remind != '') {
    // NOTE: メッセージにpushするときはリストに注意
    blocks[1].fields.push({
      "type": "mrkdwn",
      "text": "*リマインド*:\n" + getyyyyMMddDOWHHmm(remind)
    });
  } else {
    blocks[1].fields.push({
      "type": "plain_text",
      "text": "リマインドなし"
    });
  }
  return blocks;
}

