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
              "text": "Help",
              "emoji": true
            },
            "value": "help"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Today*"
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "initial_options": [
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "~*Get into the garden :house_with_garden:*~"
                },
                "value": "option 1"
              }
            ],
            "options": [
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "~*Get into the garden :house_with_garden:*~"
                },
                "value": "option 1"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Get the groundskeeper wet :sweat_drops:*"
                },
                "value": "option 2"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Steal the groundskeeper's keys :old_key:*"
                },
                "value": "option 3"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Make the groundskeeper wear his sun hat :male-farmer:*"
                },
                "value": "option 4"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Rake in the lake :	<<<<<<<<ocean:*"
                },
                "value": "option 5"
              },
              {
                "text": {
                  "type": "mrkdwn",
                  "text": "*Have a picnic :knife_fork_plate:*"
                },
                "value": "option 6",
                "description": {
                  "type": "mrkdwn",
                  "text": "リマインド時間 x日～x日x時"
                }
              }
            ]
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
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "タスク一覧"
        }
      },
      {
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
                "text": "Option 2",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Option 3",
                "emoji": true
              },
              "value": "value-2"
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
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "ここにタスクの表示",
          "emoji": true
        }
      }
    ]
  }
  return view;
}

/**
 * Homeの初期ビューを送信
 */
function publishView4HomeInit(user_id) {
  var view = generateView4Home();
  publishView(user_id, view);
}
