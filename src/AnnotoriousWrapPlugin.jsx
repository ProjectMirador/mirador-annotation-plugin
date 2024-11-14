import React from 'react';
import { Annotorious, OpenSeadragonAnnotator, OpenSeadragonViewer } from '@annotorious/react';

/* wrap mirador's OSD viewer in Annotorious context */
const AnnotatorPlugin = (props) => {
  return (
    <Annotorious>
        <OpenSeadragonAnnotator>
            {props.children}
        </OpenSeadragonAnnotator>
    </Annotorious>
  );
};

export default AnnotatorPlugin;