import miradorAnnotationPlugin from './plugins/miradorAnnotationPlugin.jsx';
import externalStorageAnnotationPlugin from './plugins/externalStorageAnnotationPlugin.jsx';
import canvasAnnotationsPlugin from './plugins/canvasAnnotationsPlugin.jsx';
import annotationCreationCompanionWindow from './plugins/annotationCreationCompanionWindow.jsx';
import windowSideBarButtonsPlugin from './plugins/windowSideBarButtonsPlugin.jsx';

export {
  miradorAnnotationPlugin, externalStorageAnnotationPlugin,
  canvasAnnotationsPlugin, annotationCreationCompanionWindow,
  windowSideBarButtonsPlugin,
};

export default [
  miradorAnnotationPlugin,
  externalStorageAnnotationPlugin,
  canvasAnnotationsPlugin,
  annotationCreationCompanionWindow,
  windowSideBarButtonsPlugin,
];
