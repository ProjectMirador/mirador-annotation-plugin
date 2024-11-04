// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import DeleteIcon from '@mui/icons-material/DeleteForever';
// import EditIcon from '@mui/icons-material/Edit';
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import flatten from 'lodash/flatten';
// import AnnotationActionsContext from './AnnotationActionsContext';

// /** */
// class CanvasListItem extends Component {
//   /** */
//   constructor(props) {
//     super(props);

//     this.state = {
//       isHovering: false,
//     };

//     this.handleMouseHover = this.handleMouseHover.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
//     this.handleEdit = this.handleEdit.bind(this);
//   }

//   /** */
//   handleDelete() {
//     const { canvases, receiveAnnotation, storageAdapter } = this.context;
//     const { annotationid } = this.props;
//     canvases.forEach((canvas) => {
//       const adapter = storageAdapter(canvas.id);
//       adapter.delete(annotationid).then((annoPage) => {
//         receiveAnnotation(canvas.id, adapter.annotationPageId, annoPage);
//       });
//     });
//   }

//   /** */
//   handleEdit() {
//     const {
//       addCompanionWindow, canvases, annotationsOnCanvases,
//     } = this.context;
//     const { annotationid } = this.props;
//     let annotation;
//     canvases.some((canvas) => {
//       if (annotationsOnCanvases[canvas.id]) {
//         Object.entries(annotationsOnCanvases[canvas.id]).forEach(([key, value], i) => {
//           if (value.json && value.json.items) {
//             annotation = value.json.items.find((anno) => anno.id === annotationid);
//           }
//         });
//       }
//       return (annotation);
//     });
//     addCompanionWindow('annotationCreation', {
//       annotationid,
//       position: 'right',
//     });
//   }

//   /** */
//   handleMouseHover() {
//     this.setState((prevState) => ({
//       isHovering: !prevState.isHovering,
//     }));
//   }

//   /** */
//   editable() {
//     const { annotationsOnCanvases, canvases } = this.context;
//     const { annotationid } = this.props;
//     const annoIds = canvases.map((canvas) => {
//       if (annotationsOnCanvases[canvas.id]) {
//         return flatten(Object.entries(annotationsOnCanvases[canvas.id]).map(([key, value], i) => {
//           if (value.json && value.json.items) {
//             return value.json.items.map((item) => item.id);
//           }
//           return [];
//         }));
//       }
//       return [];
//     });
//     return flatten(annoIds).includes(annotationid);
//   }

//   /** */
//   render() {
//     const { children } = this.props;
//     const { isHovering } = this.state;
//     const { windowViewType, toggleSingleCanvasDialogOpen } = this.context;
//     return (
//       <div
//         onMouseEnter={this.handleMouseHover}
//         onMouseLeave={this.handleMouseHover}
//       >
//         {isHovering && this.editable() && (
//           <div
//             style={{
//               position: 'relative',
//               top: -20,
//               zIndex: 10000,
//             }}
//           >
//             <ToggleButtonGroup
//               aria-label="annotation tools"
//               size="small"
//               style={{
//                 position: 'absolute',
//                 right: 0,
//               }}
//             >
//               <ToggleButton
//                 aria-label="Edit"
//                 onClick={windowViewType === 'single' ? this.handleEdit : toggleSingleCanvasDialogOpen}
//                 value="edit"
//               >
//                 <EditIcon />
//               </ToggleButton>
//               <ToggleButton aria-label="Delete" onClick={this.handleDelete} value="delete">
//                 <DeleteIcon />
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </div>
//         )}
//         <li
//           {...this.props} // eslint-disable-line react/jsx-props-no-spreading
//         >
//           {children}
//         </li>
//       </div>
//     );
//   }
// }

// CanvasListItem.propTypes = {
//   annotationid: PropTypes.string.isRequired,
//   children: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.node,
//   ]).isRequired,
// };

// CanvasListItem.contextType = AnnotationActionsContext;

// export default CanvasListItem;
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import flatten from 'lodash/flatten';
import AnnotationActionsContext from './AnnotationActionsContext';

const CanvasListItem = React.forwardRef(({ annotationid, children, ...props }, ref) => {
  const [isHovering, setIsHovering] = useState(false);
  const context = useContext(AnnotationActionsContext);
  const { canvases, receiveAnnotation, storageAdapter, addCompanionWindow, annotationsOnCanvases, windowViewType, toggleSingleCanvasDialogOpen } = context;

  const handleMouseHover = () => {
    setIsHovering((prev) => !prev);
  };

  const handleDelete = () => {
    canvases.forEach((canvas) => {
      const adapter = storageAdapter(canvas.id);
      adapter.delete(annotationid).then((annoPage) => {
        receiveAnnotation(canvas.id, adapter.annotationPageId, annoPage);
      });
    });
  };

  const handleEdit = () => {
    let annotation;
    canvases.some((canvas) => {
      if (annotationsOnCanvases[canvas.id]) {
        Object.entries(annotationsOnCanvases[canvas.id]).forEach(([key, value]) => {
          if (value.json && value.json.items) {
            annotation = value.json.items.find((anno) => anno.id === annotationid);
          }
        });
      }
      return annotation;
    });
    addCompanionWindow('annotationCreation', {
      annotationid,
      position: 'right',
    });
  };

  const editable = () => {
    const annoIds = canvases.flatMap((canvas) => {
      if (annotationsOnCanvases[canvas.id]) {
        return flatten(Object.entries(annotationsOnCanvases[canvas.id]).map(([key, value]) => {
          if (value.json && value.json.items) {
            return value.json.items.map((item) => item.id);
          }
          return [];
        }));
      }
      return [];
    });
    return annoIds.includes(annotationid);
  };

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseHover}
      ref={ref}
    >
      {isHovering && editable() && (
        <div
          style={{
            position: 'relative',
            top: -20,
            zIndex: 10000,
          }}
        >
          <ToggleButtonGroup
            aria-label="annotation tools"
            size="small"
            style={{
              position: 'absolute',
              right: 0,
            }}
          >
            <ToggleButton
              aria-label="Edit"
              onClick={windowViewType === 'single' ? handleEdit : toggleSingleCanvasDialogOpen}
              value="edit"
            >
              <EditIcon />
            </ToggleButton>
            <ToggleButton aria-label="Delete" onClick={handleDelete} value="delete">
              <DeleteIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
      <li
        {...props} // eslint-disable-line react/jsx-props-no-spreading
      >
        {children}
      </li>
    </div>
  );
});

CanvasListItem.propTypes = {
  annotationid: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
};

export default CanvasListItem;
