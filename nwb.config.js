const path = require('path');

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'MiradorAnnotation',
      externals: {
        react: 'React',
      },
    },
  },
  webpack: {
    aliases: {
      '@mui/material': path.resolve('./', 'node_modules', '@mui/material'),
      // '@material-ui/styles': path.resolve('./', 'node_modules', '@material-ui/styles'),
      react: path.resolve('./', 'node_modules', 'react'),
      'react-dom': path.resolve('./', 'node_modules', 'react-dom'),
    },
  },
};
