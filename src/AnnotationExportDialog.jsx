import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import GetAppIcon from '@mui/icons-material/GetApp';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

// Styled component
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:focus': {
    backgroundColor: theme.palette.action.focus,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AnnotationExportDialog = ({ canvases, config, handleClose, open }) => {
  const [exportLinks, setExportLinks] = useState([]);

  useEffect(() => {
    const fetchExportLinks = async () => {
      const links = await Promise.all(
        canvases.map(async (canvas) => {
          const store = config.annotation.adapter(canvas.id);
          const content = await store.all();
          if (content) {
            const label = (canvas.__jsonld && canvas.__jsonld.label) || canvas.id;
            const data = new Blob([JSON.stringify(content)], { type: 'application/json' });
            const url = window.URL.createObjectURL(data);
            return {
              canvasId: canvas.id,
              id: content.id || content['@id'],
              label,
              url,
            };
          }
          return null;
        })
      );
      setExportLinks(links.filter(Boolean));
    };

    if (open) {
      fetchExportLinks();
    }
  }, [canvases, config, open]);

  const closeDialog = () => {
    setExportLinks([]);
    handleClose();
  };

  return (
    <Dialog
      aria-labelledby="annotation-export-dialog-title"
      id="annotation-export-dialog"
      onClose={closeDialog}
      onEscapeKeyDown={closeDialog}
      open={open}
    >
      <DialogTitle id="annotation-export-dialog-title" disableTypography>
        <Typography variant="h2">Export Annotations</Typography>
      </DialogTitle>
      <DialogContent>
        {exportLinks.length === 0 ? (
          <Typography variant="body1">No annotations stored yet.</Typography>
        ) : (
          <MenuList>
            {exportLinks.map((dl) => (
              <StyledMenuItem
                button
                component="a"
                key={dl.canvasId}
                aria-label={`Export annotations for ${dl.label}`}
                href={dl.url}
                download={`${dl.id}.json`}
              >
                <ListItemIcon>
                  <GetAppIcon />
                </ListItemIcon>
                <ListItemText>
                  {`Export annotations for "${dl.label}"`}
                </ListItemText>
              </StyledMenuItem>
            ))}
          </MenuList>
        )}
      </DialogContent>
    </Dialog>
  );
};

AnnotationExportDialog.propTypes = {
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string }),
  ).isRequired,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
    }),
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AnnotationExportDialog;
