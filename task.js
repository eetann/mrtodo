/**
 * タスククラス
 */
function Task(values) {
  this.name = values.name.name.value;
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
}
