import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Download, RotateCcw } from 'lucide-react';

const TableControls = ({
  searchTerm,
  setSearchTerm,
  genreFilter,
  setGenreFilter,
  uniqueGenres,
  onDownload,
  onReset,
  totalRecords,
  filteredRecords,
  modifiedCount,
  currentPage
}) => {
  return (
    <>
      {/* Search and Filter Controls */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search all columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Genre Filter */}
              <div className="w-full sm:w-48">
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="py-3 px-4 text-white border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {uniqueGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button 
                onClick={onDownload} 
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-5 w-5" />
                Download CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={onReset} 
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-white hover:bg-gray-50 px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <RotateCcw className="h-5 w-5" />
                Reset All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold mb-2">{totalRecords.toLocaleString()}</div>
            <div className="text-blue-100 font-medium">Total Records</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold mb-2">{filteredRecords.toLocaleString()}</div>
            <div className="text-green-100 font-medium">Showing</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold mb-2">{modifiedCount.toLocaleString()}</div>
            <div className="text-orange-100 font-medium">Modified Rows</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold mb-2">{currentPage}</div>
            <div className="text-purple-100 font-medium">Current Page</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TableControls;