export function getCurrentPath(settings) {
  const selected = settings.selectedPath;
  return settings.pathsList.find( path => path.label === selected );
}

export function hasPaths(state) {
  const list = state.settings.get('pathsList').toJS();
  const l = list.length;
  if (l > 0){
    return true;
  }
  return false;
}
