// src/components/CustomToolbar.jsx
import React from 'react';
import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function CustomToolbar({ onExport }) {
  return (
    <GridToolbarContainer 
      sx={{ 
        p: 1.5, 
        bgcolor: '#f8fafc', 
        borderBottom: '1px solid #e2e8f0',
        // Định nghĩa flexbox thông qua sx css chuẩn của MUI
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}
    >
      <Box sx={{ width: '30%', display: 'flex', alignItems: 'center' }}>
        <GridToolbarQuickFilter 
          variant="outlined" 
          size="small" 
          fullWidth
          sx={{ 
            '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '6px' }
          }} 
        />
      </Box>
      
      <Button 
        variant="contained" 
        sx={{ 
          bgcolor: '#0d9488', 
          '&:hover': { bgcolor: '#0f766e' }, 
          borderRadius: '6px', 
          textTransform: 'none', 
          fontWeight: 'bold',
          height: '36px'
        }}
        startIcon={<DownloadIcon />} 
        onClick={onExport}
        size="small"
      >
        Xuất File Excel chuẩn
      </Button>
    </GridToolbarContainer>
  );
}