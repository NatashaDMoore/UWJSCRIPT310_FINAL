describe('testing tests', () => {
    it('should add two numbers', () => {
       const result = add(5,5);
       expect(result).toEqual(10);
    });
});

describe('movie tests', () => {
    it('should convert string from search into string for url', () => {
       const userInput = ' Fight Club  ';
        const result = formatString(userInput);
        expect(result).toEqual('Fight+Club');
        console.log(result);
    });
    
    it('should return genre names for valid IDs', () => {
        const genreIds = [28, 12, 16];
        const result = getGenres(genreIds);
        expect(result).toEqual(['Action', 'Adventure', 'Animation']);
    });

    it('should return "Unknown" for invalid IDs', () => {
        const genreIds = [999, 123];
        const result = getGenres(genreIds);
        expect(result).toEqual(['Unknown', 'Unknown']);
    });
    
});