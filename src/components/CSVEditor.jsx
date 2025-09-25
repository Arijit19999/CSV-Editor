import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUpload from './FileUpload';
import TableControls from './TableControls';
import DataTable from './DataTable';

const CSVEditor = () => {
  // State management
  const [originalData, setOriginalData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modifiedCells, setModifiedCells] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all'); // Changed from '' to 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [alert, setAlert] = useState(null);

  // Show alert function
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handle file upload from FileUpload component
  const handleDataLoaded = (data, name) => {
    setOriginalData(data);
    setCurrentData(data);
    setModifiedCells(new Map());
    setFileName(name);
    setSearchTerm('');
    setGenreFilter('all'); // Reset to 'all' instead of ''
    setCurrentPage(1);
    showAlert(`Data loaded successfully! (${data.length.toLocaleString()} records)`, 'success');
  };

  // Handle loading state
  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...currentData];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(term)
        )
      );
    }

    // Apply genre filter - Updated logic to handle 'all' value
    if (genreFilter && genreFilter !== 'all') {
      filtered = filtered.filter(row => row.Genre === genreFilter);
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [currentData, searchTerm, genreFilter, sortColumn, sortDirection]);

  // Handle cell edit
  const handleCellEdit = (rowId, column, newValue) => {
    const newModifiedCells = new Map(modifiedCells);
    
    if (!newModifiedCells.has(rowId)) {
      newModifiedCells.set(rowId, {});
    }
    newModifiedCells.get(rowId)[column] = newValue;
    setModifiedCells(newModifiedCells);

    // Update current data
    const updatedData = currentData.map(row => {
      if (row.id === rowId) {
        return { ...row, [column]: newValue };
      }
      return row;
    });
    setCurrentData(updatedData);
  };

  // Reset all changes
  const resetAllChanges = () => {
    setCurrentData([...originalData]);
    setModifiedCells(new Map());
    showAlert('All changes have been reset!', 'success');
  };

  // Download CSV
  const downloadCSV = () => {
    if (currentData.length === 0) return;

    const headers = Object.keys(currentData[0]).filter(key => key !== 'id');
    const csvContent = [
      headers.join(','),
      ...currentData.map(row =>
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `edited-${fileName || 'data.csv'}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('CSV file downloaded successfully!', 'success');
  };

  // Get unique genres for filter
  const uniqueGenres = [...new Set(currentData.map(row => row.Genre))].sort();
  const columns = originalData.length > 0 ? Object.keys(originalData[0]).filter(key => key !== 'id') : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert className={`${alert.type === 'error' ? 'border-red-500 text-red-700 bg-red-50' : 'border-green-500 text-green-700 bg-green-50'}`}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-800 mb-2">Processing CSV file...</p>
            <p className="text-sm text-gray-500">This may take a moment for large files</p>
          </div>
        </div>
      )}

      {/* Header - Full Width */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">CSV Editor</h1>
              <p className="text-lg text-gray-600">Upload, edit, and download CSV files with ease</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Assessment Project</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  React + Tailwind
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload Section */}
        {originalData.length === 0 ? (
          <div className="w-full max-w-4xl mx-auto">
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              onLoadingChange={handleLoadingChange}
              onAlert={showAlert}
            />
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* Controls Section */}
            <TableControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              genreFilter={genreFilter}
              setGenreFilter={setGenreFilter}
              uniqueGenres={uniqueGenres}
              onDownload={downloadCSV}
              onReset={resetAllChanges}
              totalRecords={originalData.length}
              filteredRecords={filteredData.length}
              modifiedCount={modifiedCells.size}
              currentPage={currentPage}
            />

            {/* Data Table Section */}
            <DataTable
              data={filteredData}
              columns={columns}
              modifiedCells={modifiedCells}
              onCellEdit={handleCellEdit}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={(column) => {
                if (sortColumn === column) {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortColumn(column);
                  setSortDirection('asc');
                }
              }}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVEditor;