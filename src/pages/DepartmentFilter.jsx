// src/pages/DepartmentFilter.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function DepartmentFilter({ rows, onExport, onView, onEdit, onDelete }) {
  const [selectedDept, setSelectedDept] = useState('');
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState(rows);

  useEffect(() => {
    // Gom danh sách phòng ban không trùng lặp
    const depts = [...new Set(rows.map(r => r['Phòng/Ban']).filter(Boolean))];
    setDepartments(depts);
  }, [rows]);

  useEffect(() => {
    if (!selectedDept) {
      setFiltered(rows);
    } else {
      setFiltered(rows.filter(r => r['Phòng/Ban'] === selectedDept));
    }
  }, [selectedDept, rows]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Card elevation={0} sx={{ mb: 2, border: '1px solid #cbd5e1', bgcolor: '#f8fafc' }}>
        <CardContent sx={{ py: '14px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="#0f172a">🏢 Lọc Theo Phòng Ban</Typography>
            <FormControl size="small" sx={{ width: 220 }}>
              <InputLabel>Chọn Phòng / Ban</InputLabel>
              <Select
                value={selectedDept}
                label="Chọn Phòng / Ban"
                onChange={(e) => setSelectedDept(e.target.value)}
                sx={{ bgcolor: '#fff' }}
              >
                <MenuItem value=""><em>Tất cả phòng ban</em></MenuItem>
                {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', px: 2, py: 0.5, bgcolor: '#e0f2fe', borderRadius: '8px', border: '1px solid #0369a1' }}>
              <Typography variant="caption" color="#0369a1" fontWeight="bold" display="block">TỔNG THIẾT BỊ</Typography>
              <Typography variant="h5" fontWeight="900" color="#0369a1">{filtered.length}</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onExport(filtered)}
              sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', height: '42px' }}
            >
              Tải Excel Phòng Ban
            </Button>
          </Box>

        </CardContent>
      </Card>
      <AssetDataGrid rows={filtered} columns={getGridColumns(onView, onEdit, onDelete)} onExport={() => onExport(filtered)} />
    </Box>
  );
}