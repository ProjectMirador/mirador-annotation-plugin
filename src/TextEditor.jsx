import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils } from 'draft-js';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BoldIcon from '@mui/icons-material/FormatBold';
import ItalicIcon from '@mui/icons-material/FormatItalic';
import { styled } from '@mui/material/styles';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

// Styled component for the editor root
const EditorRoot = styled('div')(({ theme }) => ({
  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: 1,
  fontFamily: theme.typography.fontFamily,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  minHeight: theme.typography.fontSize * 6,
  padding: theme.spacing(1),
}));

const TextEditor = ({ annoHtml, updateAnnotationBody }) => {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(stateFromHTML(annoHtml)));
  const editorRef = useRef(null);

  const handleFocus = () => {
    if (editorRef.current) editorRef.current.focus();
  };

  const handleFormating = (event, newFormat) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, newFormat));
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    if (updateAnnotationBody) {
      const options = {
        inlineStyles: {
          BOLD: { element: 'b' },
          ITALIC: { element: 'i' },
        },
      };
      updateAnnotationBody(stateToHTML(newEditorState.getCurrentContent(), options).toString());
    }
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div>
      <ToggleButtonGroup
        size="small"
        value={currentStyle.toArray()}
      >
        <ToggleButton
          onClick={handleFormating}
          value="BOLD"
        >
          <BoldIcon />
        </ToggleButton>
        <ToggleButton
          onClick={handleFormating}
          value="ITALIC"
        >
          <ItalicIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <EditorRoot onClick={handleFocus}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          ref={editorRef}
        />
      </EditorRoot>
    </div>
  );
};

TextEditor.propTypes = {
  annoHtml: PropTypes.string,
  updateAnnotationBody: PropTypes.func,
};

TextEditor.defaultProps = {
  annoHtml: '',
  updateAnnotationBody: () => {},
};

export default TextEditor;
