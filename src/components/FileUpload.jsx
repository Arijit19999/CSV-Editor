import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet } from 'lucide-react';

const FileUpload = ({ onDataLoaded, onLoadingChange, onAlert }) => {
  const fileInputRef = useRef(null);

  // Sample data generator
  const generateSampleData = useCallback((count = 10000) => {
    const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Thriller', 'Horror', 'Poetry', 'Drama', 'Comedy'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Mary', 'James', 'Jennifer', 'William', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    const bookTitles = ['The Journey', 'Hidden Secrets', 'Lost Chronicles', 'Midnight Tales', 'Ancient Wisdom', 'Future Visions', 'Silent Echoes', 'Dancing Shadows', 'Crimson Dawn', 'Golden Horizons'];

    const data = [];
    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const titleBase = bookTitles[Math.floor(Math.random() * bookTitles.length)];
      
      data.push({
        id: i - 1,
        Title: `${titleBase} ${i}`,
        Author: `${firstName} ${lastName}`,
        Genre: genres[Math.floor(Math.random() * genres.length)],
        PublishedYear: 1950 + Math.floor(Math.random() * 74),
        ISBN: `978-${String(i).padStart(10, '0')}`
      });
    }
    return data;
  }, []);

  // CSV parsing function
  const parseCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('Empty file'));
            return;
          }

          // Parse CSV (basic implementation)
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          const data = lines.slice(1).map((line, index) => {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim().replace(/^"|"$/g, ''));

            const row = { id: index };
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            return row;
          });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    onLoadingChange(true);
    
    try {
      const data = await parseCSV(file);
      onDataLoaded(data, file.name);
    } catch (error) {
      onAlert(`Error parsing CSV: ${error.message}`, 'error');
    } finally {
      onLoadingChange(false);
    }
  };

  // Generate sample data
  const handleGenerateSampleData = () => {
    onLoadingChange(true);
    setTimeout(() => {
      const sampleData = generateSampleData(10000);
      onDataLoaded(sampleData, 'sample-books-10000.csv');
      onLoadingChange(false);
    }, 100);
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <FileSpreadsheet className="h-8 w-8 text-blue-600" />
          Get Started
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 mt-2">
          Upload your CSV file or generate sample data to begin editing
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          {/* Drag & Drop Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group min-h-[300px] flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              const files = Array.from(e.dataTransfer.files);
              const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'));
              if (csvFile) handleFileUpload(csvFile);
            }}
          >
            <Upload className="h-20 w-20 text-gray-400 group-hover:text-blue-500 mx-auto mb-6 transition-colors duration-300" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Upload CSV File</h3>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Click to select or drag and drop your CSV file here. 
              <br />
              <span className="text-sm text-gray-400 mt-2 block">Supports files with up to 100,000+ rows</span>
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Choose File
            </Button>
          </div>
          
          {/* Sample Data Option */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="bg-white px-6 text-gray-500 font-medium">Or try with sample data</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                variant="outline" 
                onClick={handleGenerateSampleData}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 px-8 py-3 text-lg font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="mr-3">📊</span>
                Generate Sample Data (10,000 rows)
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Creates realistic book data with titles, authors, genres, and ISBNs
              </p>
            </div>
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;