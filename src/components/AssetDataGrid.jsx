// src/components/AssetDataGrid.jsx
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material'; // <-- ĐÃ THÊM BOX VÀO ĐÂY
import CustomToolbar from './CustomToolbar';

export default function AssetDataGrid({ rows, columns, onExport, processRowUpdate }) {
  return (
    <Box sx={{ flexGrow: 1, width: '100%', height: '100%', overflow: 'hidden', bgcolor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        slots={{ toolbar: () => <CustomToolbar onExport={onExport} /> }}
        disableRowSelectionOnClick
        rowHeight={52}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 'bold', borderBottom: '2px solid #cbd5e1' },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #f1f5f9' },
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
        }}
      />
    </Box>
  );
}