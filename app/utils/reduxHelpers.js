export default function actionCreator(type, ...actions) {
  return (...actionsToApply) => {
    return actions.reduce((groupedActions, currAction, index) => {
      return {...groupedActions, [currAction]: actionsToApply[index]};
    }, { type });
  }
}
