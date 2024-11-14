import React, { useEffect, useContext, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { Annotorious, OpenSeadragonAnnotator, OpenSeadragonAnnotationPopup, OpenSeadragonAnnotatorContext, useAnnotator, useViewer } from '@annotorious/react';
import AnnotationCreationCompanionWindow from './AnnotoriousCreationCompanionWindow';

const AnnotoriousHooks = (props) => {
    const { windowId } = props;
    const context = useContext(OpenSeadragonAnnotatorContext);
    const { setViewer } = context;

    const anno = useAnnotator();
    const viewer = useViewer();

    useEffect(() => {
        const viewerInstance = OSDReferences.get(windowId);
        if (viewerInstance) {
            if (!viewer) {
                setViewer(viewerInstance.current);
            }
        }
    }, [windowId, setViewer, viewer]);

    const [activeTool, setActiveTool] = useState('pointer');
    useEffect(() => {
        console.log("Active Tool: ", activeTool);
        if (viewer) {
            if (activeTool !== 'pointer') {
                viewer.setMouseNavEnabled(false);
                viewer.canvas.style.pointerEvents = 'none';
            } else {
                viewer.setMouseNavEnabled(true);
            }
        }
    }, [activeTool]);

    const handleToolChange = (event, newTool) => {
        console.log("Tool Change Event: ", event);
        if (newTool !== null) {
            setActiveTool(newTool);
            anno.setDrawingTool(newTool);
            console.log(`Tool changed to: ${newTool}`);
        }
    };

    useEffect(() => {

        if (anno) {
            anno.setDrawingEnabled(true)
            anno.setStyle({
                fill: '#00ff00',
                fillOpacity: 1,
                stroke: '#00ff00',
                strokeOpacity: 1
            });

            anno.setVisible(true);

            // TODO: why is this resetting the zoom/pan enabled, even when a non-pointer tool is selected?
            const handleCreate = annotation => {
                console.log("Annotation created:", annotation);
            };  

            const handleUpdate = annotation => {
                console.log("Annotation updated:", annotation);
            };

            const handleDelete = annotation => {
                console.log("Annotation deleted:", annotation);
            };

            anno.on('clickAnnotation', (annotation, originalEvent) => {
                console.log('Annotation clicked: ' + annotation.id);
            });

            // works, fires a lot. 
            // anno.on('viewportIntersect', (annotations) => {
            //     console.log('Annotations in viewport', annotations);
            // });

            anno.on('createAnnotation', handleCreate);
            anno.on('updateAnnotation', handleUpdate);
            anno.on('deleteAnnotation', handleDelete);

            // Cleanup listeners on component unmount
            return () => {
                anno.off('createAnnotation', handleCreate);
                anno.off('updateAnnotation', handleUpdate);
                anno.off('deleteAnnotation', handleDelete);
                anno.destroy();
            };
        }
    }, [anno]);

    return (
        <AnnotationCreationCompanionWindow {...props} handleToolChange={handleToolChange} />
    );
}

const AnnotoriousHandlers = (props) => {
    console.log("AnnotoriousViewer Props: ", props);
    // Must add Annotorious, OpenSeadragonAnnotator, contexts before AnnotoriousHooks
    // hence the weird seperation
    return (
      <Annotorious>
           <OpenSeadragonAnnotator>
              <AnnotoriousHooks {...props} />
           </OpenSeadragonAnnotator>
       </Annotorious>
    );
  };
  
export default AnnotoriousHandlers;
