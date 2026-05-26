// src/pages/DeviceTypeFilter.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function DeviceTypeFilter({ rows, onExport, onView, onEdit, onDelete }) {
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [filtered, setFiltered] = useState(rows);

  useEffect(() => {
    const allTypes = [...new Set(rows.map(r => r['Loại Thiết bị']).filter(Boolean))];
    setTypes(allTypes);
  }, [rows]);

  useEffect(() => {
    if (!selectedType) {
      setFiltered(rows);
    } else {
      setFiltered(rows.filter(r => r['Loại Thiết bị'] === selectedType));
    }
  }, [selectedType, rows]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Card elevation={0} sx={{ mb: 2, border: '1px solid #cbd5e1', bgcolor: '#f8fafc' }}>
        <CardContent sx={{ py: '14px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#0f172a">💻 Lọc Theo Loại Thiết Bị</Typography>
            <FormControl size="small" sx={{ width: 220 }}>
              <InputLabel>Chọn Loại Thiết Bị</InputLabel>
              <Select
                value={selectedType}
                label="Chọn Loại Thiết Bị"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ bgcolor: '#fff' }}
              >
                <MenuItem value=""><em>Tất cả loại máy</em></MenuItem>
                {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', px: 2, py: 0.5, bgcolor: '#f0fdf4', borderRadius: '8px', border: '1px solid #16a34a' }}>
              <Typography variant="caption" color="#16a34a" fontWeight="bold" display="block">TỔNG SỐ LƯỢNG</Typography>
              <Typography variant="h5" fontWeight="900" color="#16a34a">{filtered.length}</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onExport(filtered)}
              sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', height: '42px' }}
            >
              Tải Excel Loại Máy
            </Button>
          </Box>

        </CardContent>
      </Card>
      <AssetDataGrid rows={filtered} columns={getGridColumns(onView, onEdit, onDelete)} onExport={() => onExport(filtered)} />
    </Box>
  );
}