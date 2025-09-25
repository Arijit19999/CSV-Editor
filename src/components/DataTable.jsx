import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DataTable = ({
  data,
  columns,
  modifiedCells,
  onCellEdit,
  sortColumn,
  sortDirection,
  onSort,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  // Cell editing functions
  const startEditing = (rowId, column, currentValue) => {
    setEditingCell({ rowId, column });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const { rowId, column } = editingCell;
    onCellEdit(rowId, column, editValue);
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Handle key press in edit mode
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <>
      {/* Data Table */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white sticky top-0 z-10">
                  <tr>
                    {/* Row Number Column */}
                    <th className="px-4 py-4 text-left font-semibold w-20 border-r border-gray-700">#</th>
                    {/* Data Columns */}
                    {columns.map(column => (
                      <th
                        key={column}
                        className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-700 transition-colors duration-200 border-r border-gray-700 last:border-r-0 min-w-[150px]"
                        onClick={() => onSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{column}</span>
                          {sortColumn === column && (
                            <span className="text-blue-300 text-lg">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150">
                      {/* Row Number */}
                      <td className="px-4 py-4 text-gray-500 font-mono text-center bg-gray-50 border-r border-gray-200">
                        {startIndex + index + 1}
                      </td>
                      {/* Data Cells */}
                      {columns.map(column => {
                        const isModified = modifiedCells.has(row.id) && modifiedCells.get(row.id)[column] !== undefined;
                        const isEditing = editingCell?.rowId === row.id && editingCell?.column === column;
                        
                        return (
                          <td
                            key={column}
                            className={`px-6 py-4 cursor-pointer hover:bg-blue-100 transition-colors duration-150 border-r border-gray-100 last:border-r-0 ${
                              isModified ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            } ${isEditing ? 'bg-yellow-100' : ''}`}
                            onClick={() => !isEditing && startEditing(row.id, column, row[column])}
                          >
                            {isEditing ? (
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={saveEdit}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="truncate max-w-xs lg:max-w-sm xl:max-w-md" title={row[column]}>
                                  {row[column]}
                                </span>
                                {isModified && (
                                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-800 border-blue-300">
                                    Modified
                                  </Badge>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Rows per page selector and info */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Show:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                  <SelectTrigger className="w-40 py-2 px-3 text-white border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                    <SelectItem value="200">200 per page</SelectItem>
                    <SelectItem value="500">500 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-gray-600 text-center lg:text-left">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(startIndex + rowsPerPage, data.length)}</span> of{' '}
                <span className="font-semibold">{data.length.toLocaleString()}</span> records
              </span>
            </div>
            
            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <ChevronsLeft className="h-4 w-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4 text-blue-700" />
              </Button>
              <span className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg min-w-[120px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <ChevronsRight className="h-4 w-4 text-blue-700" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DataTable;