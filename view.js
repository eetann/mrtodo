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
