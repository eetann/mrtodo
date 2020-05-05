/**
 * スクリプトのプロパティを取得
 */
function getScriptProperty(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}
