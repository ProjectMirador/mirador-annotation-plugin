import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';
import { v4 as uuid } from 'uuid';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import AnnotoriousViewer from './AnnotoriousViewer';
import { useAnnotator } from '@annotorious/react';

import TextEditor from './TextEditor';
import WebAnnotation from './WebAnnotation';
import CursorIcon from './icons/Cursor';

import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import PolygonIcon from '@mui/icons-material/Timeline';
import GestureIcon from '@mui/icons-material/Gesture';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
}));

const StyledSection = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(2),
}));

const AnnotationCreationCompanionWindow = ({
  annotation,
  canvases,
  closeCompanionWindow,
  config,
  id,
  windowId,
  receiveAnnotation,
  handleToolChange
}) => {
  const annoState = {};
  console.log(handleToolChange)

  // Initialize state from props
  if (annotation) {
    if (Array.isArray(annotation.body)) {
      annoState.tags = [];
      annotation.body.forEach((body) => {
        if (body.purpose === 'tagging') {
          annoState.tags.push(body.value);
        } else {
          annoState.annoBody = body.value;
        }
      });
    } else {
      annoState.annoBody = annotation.body.value;
    }
    if (annotation.target.selector) {
      if (Array.isArray(annotation.target.selector)) {
        annotation.target.selector.forEach((selector) => {
          if (selector.type === 'SvgSelector') {
            annoState.svg = selector.value;
          } else if (selector.type === 'FragmentSelector') {
            annoState.xywh = selector.value.replace('xywh=', '');
          }
        });
      } else {
        annoState.svg = annotation.target.selector.value;
      }
    }
  }

  // console.log(props)
  const toolState = {
    activeTool: 'cursor',
    closedMode: 'closed',
    currentColorType: false,
    fillColor: null,
    strokeColor: '#00BFFF',
    strokeWidth: 3,
    ...(config.annotation.defaults || {}),
  };

  const [state, setState] = useState({
    ...toolState,
    annoBody: '',
    colorPopoverOpen: false,
    lineWeightPopoverOpen: false,
    popoverAnchorEl: null,
    popoverLineWeightAnchorEl: null,
    svg: null,
    textEditorStateBustingKey: 0,
    xywh: null,
    ...annoState,
  });

  const handleCloseLineWeight = () => {
    setState((prev) => ({ ...prev, lineWeightPopoverOpen: false, popoverLineWeightAnchorEl: null }));
  };

  const handleLineWeightSelect = (e) => {
    setState((prev) => ({
      ...prev,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
      strokeWidth: e.currentTarget.value,
    }));
  };

  const openChooseColor = (e) => {
    setState((prev) => ({
      ...prev,
      colorPopoverOpen: true,
      currentColorType: e.currentTarget.value,
      popoverAnchorEl: e.currentTarget,
    }));
  };

  const openChooseLineWeight = (e) => {
    setState((prev) => ({
      ...prev,
      lineWeightPopoverOpen: true,
      popoverLineWeightAnchorEl: e.currentTarget,
    }));
  };

  const closeChooseColor = () => {
    setState((prev) => ({
      ...prev,
      colorPopoverOpen: false,
      currentColorType: null,
      popoverAnchorEl: null,
    }));
  };

  const updateStrokeColor = (color) => {
    const { currentColorType } = state;
    setState((prev) => ({
      ...prev,
      [currentColorType]: color.hex,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const { annoBody, tags, xywh, svg } = state;

    canvases.forEach((canvas) => {
      const storageAdapter = config.annotation.adapter(canvas.id);
      const anno = new WebAnnotation({
        body: annoBody,
        canvasId: canvas.id,
        id: (annotation && annotation.id) || `${uuid()}`,
        manifestId: canvas.options.resource.id,
        svg,
        tags,
        xywh,
      }).toJson();
      if (annotation) {
        storageAdapter.update(anno).then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
      } else {
        storageAdapter.create(anno).then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
      }
    });

    setState((prev) => ({
      ...prev,
      annoBody: '',
      svg: null,
      textEditorStateBustingKey: prev.textEditorStateBustingKey + 1,
      xywh: null,
    }));
  };

  // const changeTool = (e, tool) => {
  //   console.log(e, tool)
  //   setState((prev) => ({ ...prev, activeTool: tool }));
  //   anno.setDrawingTool('rectangle');
  // };

  const changeClosedMode = (e) => {
    setState((prev) => ({ ...prev, closedMode: e.currentTarget.value }));
  };

  const updateBody = (annoBody) => {
    setState((prev) => ({ ...prev, annoBody }));
  };

  const updateGeometry = ({ svg, xywh }) => {
    setState((prev) => ({ ...prev, svg, xywh }));
  };

  const {
    activeTool, colorPopoverOpen, currentColorType, fillColor, popoverAnchorEl,
    strokeColor, popoverLineWeightAnchorEl, lineWeightPopoverOpen, strokeWidth, closedMode,
    annoBody, textEditorStateBustingKey, svg,
  } = state;

  return (
    <CompanionWindow
      title={annotation ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      {/* <AnnotoriousViewer windowId={windowId} > */}

      {/* <AnnotationDrawing
        activeTool={activeTool}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        closed={closedMode === 'closed'}
        svg={svg}
        updateGeometry={updateGeometry}
        windowId={windowId}
      /> */}
      <form onSubmit={submitForm}>
        <StyledSection>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">Target</Typography>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper elevation={0}>
                <ToggleButtonGroup
                  value={activeTool}
                  exclusive
                  onChange={handleToolChange}
                  aria-label="tool selection"
                  size="small"
                >
                  <ToggleButton value="cursor" aria-label="select cursor">
                    <CursorIcon />
                  </ToggleButton>
                  <ToggleButton value="edit" aria-label="select edit">
                    <FormatShapesIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                <Divider flexItem orientation="vertical" />
                <ToggleButtonGroup
                  value={activeTool}
                  exclusive
                  onChange={handleToolChange}
                  aria-label="shape selection"
                  size="small"
                >
                  <ToggleButton value="rectangle" aria-label="add a rectangle">
                    <RectangleIcon />
                  </ToggleButton>
                  <ToggleButton value="ellipse" aria-label="add a circle">
                    <CircleIcon />
                  </ToggleButton>
                  <ToggleButton value="polygon" aria-label="add a polygon">
                    <PolygonIcon />
                  </ToggleButton>
                  <ToggleButton value="freehand" aria-label="free hand polygon">
                    <GestureIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </StyledPaper>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">Style</Typography>
            </Grid>
            <Grid item xs={12}>
              <ToggleButtonGroup aria-label="style selection" size="small">
                <ToggleButton
                  value="strokeColor"
                  aria-label="select color"
                  onClick={openChooseColor}
                >
                  <StrokeColorIcon style={{ fill: strokeColor }} />
                  <ArrowDropDownIcon />
                </ToggleButton>
                <ToggleButton
                  value="lineWeight"
                  aria-label="select line weight"
                  onClick={openChooseLineWeight}
                >
                  <LineWeightIcon />
                  <ArrowDropDownIcon />
                </ToggleButton>
                <ToggleButton
                  value="fillColor"
                  aria-label="select color"
                  onClick={openChooseColor}
                >
                  <FormatColorFillIcon style={{ fill: fillColor }} />
                  <ArrowDropDownIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider flexItem orientation="vertical" />
              {activeTool === 'freehand' && (
                <ToggleButtonGroup size="small" value={closedMode} onChange={changeClosedMode}>
                  <ToggleButton value="closed">
                    <ClosedPolygonIcon />
                  </ToggleButton>
                  <ToggleButton value="open">
                    <OpenPolygonIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">Content</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextEditor
                key={textEditorStateBustingKey}
                annoHtml={annoBody}
                updateAnnotationBody={updateBody}
              />
            </Grid>
          </Grid>
          <Button onClick={closeCompanionWindow}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">Save</Button>
        </StyledSection>
      </form>
      <Popover
        open={lineWeightPopoverOpen}
        anchorEl={popoverLineWeightAnchorEl}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleCloseLineWeight}>
            <MenuList autoFocus role="listbox">
              {[1, 3, 5, 10, 50].map((option) => (
                <MenuItem
                  key={option}
                  onClick={handleLineWeightSelect}
                  value={option}
                  selected={option === strokeWidth}
                  role="option"
                  aria-selected={option === strokeWidth}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
      <Popover
        open={colorPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={closeChooseColor}
      >
        <SketchPicker
          color={state[currentColorType] || {}}
          onChangeComplete={updateStrokeColor}
        />
      </Popover>
      {/* </AnnotoriousViewer> */}
    </CompanionWindow>
  );
};

AnnotationCreationCompanionWindow.propTypes = {
  annotation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  closeCompanionWindow: PropTypes.func,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
      defaults: PropTypes.objectOf(
        PropTypes.oneOfType(
          [PropTypes.bool, PropTypes.func, PropTypes.number, PropTypes.string]
        )
      ),
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
  receiveAnnotation: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

AnnotationCreationCompanionWindow.defaultProps = {
  annotation: null,
  canvases: [],
  closeCompanionWindow: () => {},
};

export default AnnotationCreationCompanionWindow;
