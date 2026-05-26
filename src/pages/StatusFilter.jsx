// src/pages/StatusFilter.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function StatusFilter({ rows, onExport, onView, onEdit, onDelete }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [filtered, setFiltered] = useState(rows);

  useEffect(() => {
    const allStatuses = [...new Set(rows.map(r => r['Tình trạng']).filter(Boolean))];
    setStatuses(allStatuses);
  }, [rows]);

  useEffect(() => {
    if (!selectedStatus) {
      setFiltered(rows);
    } else {
      setFiltered(rows.filter(r => r['Tình trạng'] === selectedStatus));
    }
  }, [selectedStatus, rows]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Card elevation={0} sx={{ mb: 2, border: '1px solid #cbd5e1', bgcolor: '#f8fafc' }}>
        <CardContent sx={{ py: '14px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#0f172a">⚠️ Lọc Theo Tình Trạng</Typography>
            <FormControl size="small" sx={{ width: 220 }}>
              <InputLabel>Chọn Tình Trạng</InputLabel>
              <Select
                value={selectedStatus}
                label="Chọn Tình Trạng"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ bgcolor: '#fff' }}
              >
                <MenuItem value=""><em>Tất cả tình trạng</em></MenuItem>
                {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', px: 2, py: 0.5, bgcolor: '#ffedd5', borderRadius: '8px', border: '1px solid #ea580c' }}>
              <Typography variant="caption" color="#ea580c" fontWeight="bold" display="block">SỐ THIẾT BỊ LỌC</Typography>
              <Typography variant="h5" fontWeight="900" color="#ea580c">{filtered.length}</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onExport(filtered)}
              sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', height: '42px' }}
            >
              Tải Excel Tình Trạng
            </Button>
          </Box>

        </CardContent>
      </Card>
      <AssetDataGrid rows={filtered} columns={getGridColumns(onView, onEdit, onDelete)} onExport={() => onExport(filtered)} />
    </Box>
  );
}