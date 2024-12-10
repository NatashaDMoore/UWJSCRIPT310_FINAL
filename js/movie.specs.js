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
        console.log(result);
        expect(result).toEqual('Fight+Club');
    });

    it('should return genre names for valid IDs', () => {
        const genreIds = [28, 12, 16];
        const result = getGenres(genreIds);
        console.log(result);
        expect(result).toEqual(['Action', 'Adventure', 'Animation']);
    });

    it('should return "Unknown" for invalid IDs', () => {
        const genreIds = [999, 123];
        const result = getGenres(genreIds);
        expect(result).toEqual(['Unknown', 'Unknown']);
    });

    it('should return the correct certification for ID', () => {
        expect(getCertification(4)).toBe('R');
        expect(getCertification(2)).toBe('PG');
        expect(getCertification(5)).toBe('NC-17');
        expect(getCertification(1)).toBe('G');
        expect(getCertification(0)).toBe('NR');
        expect(getCertification(3)).toBe('PG-13');
    });

    it('should return "Unknown" for invalid ID', () => {
        expect(getCertification(6)).toBe('Unknown');
        expect(getCertification(-1)).toBe('Unknown');
        expect(getCertification(null)).toBe('Unknown');
        expect(getCertification(undefined)).toBe('Unknown');
    });
    
});