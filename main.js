/**
 * Slackからの入力を受け取る
 */

function doPost(e) {
  // NOTE: スラッシュコマンドよりもショートカットのほうが入力が楽
  // NOTE: callback_id や trigger_id が e の中のどこに含まれているか注意
  // NOTE: textには文字数の制限がある msgPost(JSON.stringify(payload.view));
  try {
    if (e.parameter.type == 'interaction') {
      // Interactivity & Shortcuts
      var payload = JSON.parse(e.parameter.payload);
      if (payload.type == 'view_submission') {
        var values = payload.view.state.values;
        if (payload.view.callback_id == 'add_task_submit') {
          addTask(values);
        }
      } else if (payload.type == 'shortcut') {
        if (payload.callback_id == 'add_task_call') {
          openView4AddTaskInit(payload.trigger_id);
        }
      } else if (payload.type == 'block_actions') {
        var action_id = payload.actions[0].action_id;
        if (action_id == 'add_remind') {
          updateView4AddTaskRemind(payload.container.view_id);
        } else if (action_id == 'delete_remind') {
          // TODO: ここから view を再利用
          updateView4DeleteTaskRemind(payload.container.view_id);
        } else {
          var actions = action_id.trim().split(' ');
          if (actions[0] == 'done') {
            // checkboxesなら
            var now = null;
            if (actions[1] == 'checkboxes') {
              // now = ;
              msgPost(JSON.stringify(payload.actions));
            } else {
              now = actions[1];
              doneTask(now);
            }
            // doneTask(now);
            publishView4HomeInit(payload.user.id);
          }
        }
      }
    } else if (e.parameter.type == 'event') {
      // Event Subscriptions
      var contents = JSON.parse(e.postData.contents);
      if (contents.type == "url_verification") {
        return ContentService.createTextOutput(contents.challenge);
      } else if (contents.type == 'event_callback') {
        if (contents.event.type == 'app_home_opened') {
          publishView4HomeInit(contents.event.user);
        }
      }
    }
  } catch (e) {
    var json_data = {
      text: e.message
    };
    // postSlack(' ', [{"type": "section","text": {"type": "mrkdwn",
    //         "text": JSON.stringify(payload)}},]);
    // NOTE: JSONを返す
    return ContentService.createTextOutput(JSON.stringify(json_data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput();
}

/**
 * タスクを追加
 */
function addTask(values) {
  var task = generateTaskByModalInputs(values);
  // slackに送信
  task.postTask();
  // スプレッドシートに登録
  task.addReminder();
  task.registerTask();
}
