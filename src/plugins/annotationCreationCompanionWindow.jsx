import * as actions from 'mirador/dist/es/src/state/actions';
import { getCompanionWindow } from 'mirador/dist/es/src/state/selectors/companionWindows';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import AnnotoriousCreationCompanionWindow from '../AnnotoriousCreationCompanionWindow';
import AnnotoriousViewer from '../AnnotoriousViewer';

/** */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  closeCompanionWindow: () => dispatch(
    actions.removeCompanionWindow(windowId, id),
  ),
  receiveAnnotation: (targetId, annoId, annotation) => dispatch(
    actions.receiveAnnotation(targetId, annoId, annotation),
  ),
});

/** */
function mapStateToProps(state, { id: companionWindowId, windowId }) {
  const { annotationid } = getCompanionWindow(state, { companionWindowId, windowId });
  const canvases = getVisibleCanvases(state, { windowId });

  let annotation;
  canvases.forEach((canvas) => {
    const annotationsOnCanvas = state.annotations[canvas.id];
    Object.values(annotationsOnCanvas || {}).forEach((value, i) => {
      if (value.json && value.json.items) {
        console.log(anno)
        annotation = value.json.items.find((anno) => anno.id === annotationid);
      }
    });
  });

  return {
    annotation,
    canvases,
    config: state.config,
  };
}

export default {
  companionWindowKey: 'annotationCreation',
  // our own component
  // component: AnnotationCreation,
  // component: AnnotoriousCreationCompanionWindow,
  component: AnnotoriousViewer,
  mapDispatchToProps,
  mapStateToProps,
};
