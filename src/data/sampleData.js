export const generateSampleData = (count = 10000) => {
  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Mary', 'James', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const data = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    data.push({
      id: i - 1,
      Title: `Book Title ${i}`,
      Author: `${firstName} ${lastName}`,
      Genre: genres[Math.floor(Math.random() * genres.length)],
      PublishedYear: 1950 + Math.floor(Math.random() * 74),
      ISBN: `978-${String(i).padStart(10, '0')}`
    });
  }
  
  return data;
};