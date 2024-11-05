import React from 'react';
import { Annotorious, OpenSeadragonAnnotator } from '@annotorious/react';


/* wrap mirador's OSD viewer in Annotorious context */
const AnnotatorPlugin = (props) => {
  return (
    <Annotorious>
        <OpenSeadragonAnnotator>
            <props.TargetComponent {...props} />
        </OpenSeadragonAnnotator>
    </Annotorious>
  );
};

export default AnnotatorPlugin;