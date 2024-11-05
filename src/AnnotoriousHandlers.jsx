import React, { useEffect, useContext, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { Annotorious, OpenSeadragonAnnotator, OpenSeadragonAnnotationPopup, OpenSeadragonAnnotatorContext, useAnnotator } from '@annotorious/react';
import AnnotationCreationCompanionWindow from './AnnotoriousCreationCompanionWindow';

const AnnotoriousHooks = (props) => {
    const { windowId } = props;
    const context = useContext(OpenSeadragonAnnotatorContext);
    const { setViewer } = context;

    const anno = useAnnotator();

    useEffect(() => {
        const viewerInstance = OSDReferences.get(windowId);
        if (viewerInstance) {
            setViewer(viewerInstance.current);
        }
    }, [windowId, setViewer]);

    useEffect(() => {

        if (anno) {
            console.log("IF Annotator Value: ", anno);

            anno.setDrawingEnabled(true)
            anno.setStyle({
                fill: '#00ff00',
                fillOpacity: 1,
                stroke: '#00ff00',
                strokeOpacity: 1
            });

            // anno.setDrawingTool('polygon');
            anno.setVisible(true);

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

  // State for the active tool
  const [activeTool, setActiveTool] = useState('cursor');

  // The method you want to trigger when the button changes
  const handleToolChange = (event, newTool) => {
    if (newTool !== null) {
      // Update the state of activeTool
      setActiveTool(newTool);

      console.log(`Tool changed to: ${newTool}`);
      
      anno.setDrawingTool(newTool);
    //   console.log(anno.getDrawingTool());
    }
  };

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
