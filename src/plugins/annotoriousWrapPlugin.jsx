import { getWindow } from 'mirador/dist/es/src/state/selectors/getters';
import { getAnnotations } from 'mirador/dist/es/src/state/selectors/annotations';
import { getCurrentCanvas } from 'mirador/dist/es/src/state/selectors/canvases';
import AnnotoriousWrapPlugin from '../AnnotoriousWrapPlugin';


// https://github.com/jbaiter/mirador3-plugin-dev-tutorial
export default {
    // The plugin component that should be added
    component: AnnotoriousWrapPlugin,
    // The name of the plugin-aware Mirador 3 component that this plugin targets
    target: 'OpenSeadragonViewer',
    // Can be 'add' or 'wrap', defines how the plugin component is rendered
    /**
     * To check if a given component supports add plugins, search for uses of the PluginHook component inside of src/components modules in the Mirador 3 source code (or use this GitHub Link). The position of the <PluginHook /> definition will be the position where the plugin component is rendered.

    For components that support wrap plugins, search for uses of the withPlugins HOC inside of the src/containers modules, (or use this GitHub Link). All of the container components that are wrapped with this HOC can be wrapped by a plugin component.
     */
    mode: 'wrap',
    // Refer to the Redux documentation for these two functions. The props that are
    // passed are those of the target component
    mapDispatchToProps: (dispatch, props) => { return {testProps: props} },
    mapStateToProps: (state, { windowId }) => {
        const allAnnotations = getAnnotations(state);
        const currentCanvas = getCurrentCanvas(state, { windowId });
        // console.log("Current Canvas: ", currentCanvas);
        // Ensure currentCanvas is available and has a valid ID
        if (!currentCanvas || !currentCanvas.id) {
            return {
                manifestId: getWindow(state, { windowId }).manifestId,
                annotations: [],
                currentCanvas: null,  // Or some fallback value
            };
        }
        const currentCanvasAnnotations = allAnnotations[currentCanvas.id];

        const annotoriousFormatAnnotations = {};    
        for (const [ source, obj ] of Object.entries(currentCanvasAnnotations)) { 
            if (obj.json && obj.json.type === 'AnnotationPage') {
                if (!annotoriousFormatAnnotations[windowId]) {
                    annotoriousFormatAnnotations[windowId] = [];
                }
                annotoriousFormatAnnotations[windowId].push(...obj.json.items);
            }
        }
    
        return {
            manifestId: getWindow(state, { windowId }).manifestId,
            annotations: annotoriousFormatAnnotations[windowId] || [],
            currentCanvas,
        };
    },
    // Define new sub-stores along with their respective reducers
    // reducers: { /* ... */ },
    // Define a custom saga that should be run as part of the Mirador 3 root saga
    // saga: myCustomSaga,
}

