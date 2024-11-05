import React, { useEffect, useContext, useState } from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { Annotorious, OpenSeadragonAnnotator, OpenSeadragonAnnotationPopup, OpenSeadragonAnnotatorContext, useAnnotator } from '@annotorious/react';
import AnnotationCreationCompanionWindow from './AnnotoriousCreationCompanionWindow';

const AnnotoriousHooks = (props) => {
    const { windowId } = props;
    const context = useContext(OpenSeadragonAnnotatorContext);
    const { setViewer } = context;

    const anno = useAnnotator();
    console.log("Annotator Value: ", anno);
    // OK, now it's got props wrapping the companion window not the viewer...?

    useEffect(() => {
        const viewerInstance = OSDReferences.get(windowId);
        if (viewerInstance) {
            setViewer(viewerInstance.current);
        }
    }, [windowId, setViewer]);

    useEffect(() => {

        if (anno) {
            // anno.setAnnotations(props.annotations);
            anno.setDrawingEnabled(true)
            anno.setStyle({
                fill: '#00ff00',
                fillOpacity: 1,
                stroke: '#00ff00',
                strokeOpacity: 1
            });

            anno.setDrawingTool('polygon');
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

      // You can also trigger any additional logic here
      console.log(`Tool changed to: ${newTool}`);
      
      // For example, if you're using Annotorious, you can change the drawing tool
      anno.setDrawingTool(newTool);
    }
  };

    return (
        <AnnotationCreationCompanionWindow {...props} handleToolChange={handleToolChange} />
    );
}

const AnnotoriousViewer = (props) => {
    console.log("AnnotoriousViewer Props: ", props);
    return (
      <Annotorious>
          <OpenSeadragonAnnotator>
              <AnnotoriousHooks {...props} />
          </OpenSeadragonAnnotator>
      </Annotorious>
    );
  };
  
export default AnnotoriousViewer;