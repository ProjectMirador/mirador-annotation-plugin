import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { Annotorious } from '@annotorious/react';

/**
 * Functional Component for Annotation Drawing using Annotorious
 */
const AnnotoriousDrawing = ({
  activeTool,
  fillColor,
  strokeColor,
  strokeWidth,
  windowId,
}) => {
  const [annotator, setAnnotator] = useState(null);
  const containerRef = useRef(null);
  const OSDReference = OSDReferences.get(windowId);
  
  useEffect(() => {
    // Initialize Annotorious only after OSDReference is ready
    if (containerRef.current && OSDReference) {
      const annotatorInstance = new Annotorious({
        element: containerRef.current,
        openSeadragon: OSDReference,
      });
      setAnnotator(annotatorInstance);
      
      // Cleanup on unmount
      return () => {
        annotatorInstance.destroy();
      };
    }
  }, [OSDReference]);

  useEffect(() => {
    // If annotator is available, configure the drawing tools and style
    if (annotator) {
      // Set the drawing tool (e.g., rectangle, polygon, freehand, etc.)
      switch (activeTool) {
        case 'rectangle':
          annotator.setDrawingTool('rectangle');
          break;
        case 'polygon':
          annotator.setDrawingTool('polygon');
          break;
        case 'freehand':
          annotator.setDrawingTool('freehand');
          break;
        default:
          annotator.setDrawingTool('cursor');
          break;
      }

      // Set the drawing tool's style
      annotator.setStyle({
        fill: fillColor || '#00BFFF',
        stroke: strokeColor || '#00BFFF',
        strokeWidth: strokeWidth || 1,
      });
    }
  }, [annotator, activeTool, fillColor, strokeColor, strokeWidth]);

  const paperThing = () => {
    if (!annotator) return null;

    return (
      <div
        ref={containerRef}
        className="foo"
        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
        }}
      >
        {/* This div will serve as the container for Annotorious' canvas */}
      </div>
    );
  };

  const OSDElement = OSDReferences.get(windowId).current;
  return (
    ReactDOM.createPortal(paperThing(), OSDElement.element)
  );
};

AnnotoriousDrawing.propTypes = {
  activeTool: PropTypes.string,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  windowId: PropTypes.string.isRequired,
};

AnnotoriousDrawing.defaultProps = {
  activeTool: 'cursor', // Default tool is cursor (no drawing)
  fillColor: null,
  strokeColor: '#00BFFF',
  strokeWidth: 1,
};

export default AnnotoriousDrawing;
