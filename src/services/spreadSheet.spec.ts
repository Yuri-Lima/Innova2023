import { Auth } from 'googleapis';
import sS from './spreadSheet';

describe("Google SpreadSheet Tests", () => {
    let auth: Auth.Credentials|Auth.JWT|undefined;

    beforeAll(async() => {
       return auth = await sS.getAuthorize();
    });

    test('Google SpreadSheet Read Columns', async() => {
        const array = await sS.readSheet({
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            sheetNameRange: 'Class Data!A2:F',
            majorDimension: 'COLUMNS',
            auth,
            valueRenderOption: 'UNFORMATTED_VALUE'
        });
        console.log("Google SpreadSheet Read Columns: ", array);
        expect(array[0]).toEqual(
            [
                'Alexandra', 'Andrew',   'Anna',
                'Becky',     'Benjamin', 'Carl',
                'Carrie',    'Dorothy',  'Dylan',
                'Edward',    'Ellen',    'Fiona',
                'John',      'Jonathan', 'Joseph',
                'Josephine', 'Karen',    'Kevin',
                'Lisa',      'Mary',     'Maureen',
                'Nick',      'Olivia',   'Pamela',
                'Patrick',   'Robert',   'Sean',
                'Stacy',     'Thomas',   'Will'
            ]
        );
    });

    // Needs to be fixed because the data is not the same as the rows in the spreadsheet.
    test.skip('Google SpreadSheet Read Rows', async() => {
        const array = await sS.readSheet({
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            sheetNameRange: 'Class Data!A2:F',
            majorDimension: 'ROWS',
            auth,
            valueRenderOption: 'UNFORMATTED_VALUE'
        });
        console.log("Google SpreadSheet Read Rows: ", array);
        expect(array[0]).toEqual(
            [
                'Alexandra', 'Female', '4. Senior', 'CA', 'English', 'Drama Club'
            ]
        );
    });
});