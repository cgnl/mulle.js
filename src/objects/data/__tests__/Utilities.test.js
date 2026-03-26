/**
 * @fileoverview Tests for Utilities - Database import utilities
 * Based on: MovieScript 17 - Utilities.ls
 * 
 * Utilities provides functions for importing part database files,
 * primarily used during development/authoring.
 */

const Utilities = require('../Utilities');

describe('Utilities', () => {
  let utilities;
  let mockFileIO;

  beforeEach(() => {
    mockFileIO = {
      openFile: jest.fn(),
      readFile: jest.fn().mockReturnValue('part data'),
      closeFile: jest.fn(),
      status: jest.fn().mockReturnValue(0)
    };
  });

  describe('constructor', () => {
    test('should initialize with default path', () => {
      utilities = new Utilities();
      expect(utilities.pathString).toBeDefined();
    });

    test('should accept custom path', () => {
      utilities = new Utilities('/custom/path/');
      expect(utilities.pathString).toBe('/custom/path/');
    });
  });

  describe('importPartDB', () => {
    /**
     * Lingo: on importPartDB argFromPartID, argToPartID
     */
    describe('input validation', () => {
      test('should return error when fromPartID is undefined', () => {
        utilities = new Utilities();
        
        const result = utilities.importPartDB(undefined);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('missing partid');
      });

      test('should return error when toPartID < fromPartID', () => {
        utilities = new Utilities();
        
        const result = utilities.importPartDB(10, 5);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('greater than or equal');
      });
    });

    describe('single part import', () => {
      test('should use fromPartID as toPartID when not specified', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        utilities.importPartDB(5);
        
        expect(mockFileIO.openFile).toHaveBeenCalledTimes(1);
      });

      test('should create correct filename', () => {
        utilities = new Utilities('/path/');
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        utilities.importPartDB(42);
        
        expect(mockFileIO.openFile).toHaveBeenCalledWith('/path/Part42DB.txt', 0);
      });
    });

    describe('range import', () => {
      test('should import all parts in range', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        utilities.importPartDB(1, 3);
        
        expect(mockFileIO.openFile).toHaveBeenCalledTimes(3);
      });

      test('should close file after each import', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        utilities.importPartDB(1, 2);
        
        expect(mockFileIO.closeFile).toHaveBeenCalledTimes(2);
      });
    });

    describe('file handling', () => {
      test('should read file content when status is 0', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        mockFileIO.status.mockReturnValue(0);
        
        utilities.importPartDB(1);
        
        expect(mockFileIO.readFile).toHaveBeenCalled();
      });

      test('should not read file when status is not 0', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        mockFileIO.status.mockReturnValue(-1);
        
        utilities.importPartDB(1);
        
        expect(mockFileIO.readFile).not.toHaveBeenCalled();
      });

      test('should create member if it does not exist', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(false);
        utilities._createMember = jest.fn();
        utilities._setMemberText = jest.fn();
        
        utilities.importPartDB(5);
        
        expect(utilities._createMember).toHaveBeenCalledWith('Part5DB');
      });

      test('should set member text with file content', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        mockFileIO.readFile.mockReturnValue('test content');
        
        utilities.importPartDB(5);
        
        expect(utilities._setMemberText).toHaveBeenCalledWith('Part5DB', 'test content');
      });
    });

    describe('return value', () => {
      test('should return success with imported count', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        const result = utilities.importPartDB(1, 5);
        
        expect(result.success).toBe(true);
        expect(result.imported).toBe(5);
      });

      test('should return list of imported parts', () => {
        utilities = new Utilities();
        utilities._createFileIO = jest.fn().mockReturnValue(mockFileIO);
        utilities._memberExists = jest.fn().mockReturnValue(true);
        utilities._setMemberText = jest.fn();
        
        const result = utilities.importPartDB(10, 12);
        
        expect(result.parts).toEqual(['Part10DB', 'Part11DB', 'Part12DB']);
      });
    });
  });

  describe('getPartMemberName', () => {
    test('should return correct member name format', () => {
      utilities = new Utilities();
      expect(utilities.getPartMemberName(42)).toBe('Part42DB');
    });

    test('should handle single digit IDs', () => {
      utilities = new Utilities();
      expect(utilities.getPartMemberName(5)).toBe('Part5DB');
    });

    test('should handle large IDs', () => {
      utilities = new Utilities();
      expect(utilities.getPartMemberName(999)).toBe('Part999DB');
    });
  });
});
