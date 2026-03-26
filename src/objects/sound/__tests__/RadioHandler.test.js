/**
 * @fileoverview Tests for RadioHandler - Radio/mission dialog handler
 * Based on: ParentScript 47 - RadioHandler.ls
 * 
 * RadioHandler manages radio broadcasts including weather reports
 * and mission dialogs based on game progression level.
 */

const RadioHandler = require('../RadioHandler');

describe('RadioHandler', () => {
  let radioHandler;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      },
      weather: {
        reportWeatherToMe: jest.fn()
      },
      levelHandler: {
        getLevel: jest.fn().mockReturnValue(1)
      },
      user: {
        isMissionCompleted: jest.fn().mockReturnValue(false),
        isMissionGiven: jest.fn().mockReturnValue(false),
        addGivenMission: jest.fn()
      }
    };
  });

  afterEach(() => {
    if (radioHandler) {
      radioHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize DialogList as empty array', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.DialogList).toEqual([]);
    });

    test('should initialize dialogStartList with 6 dialog IDs', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.dialogStartList).toHaveLength(6);
      expect(radioHandler.dialogStartList).toContain('00d074v0');
    });

    test('should initialize loopCounter with random value', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.loopCounter).toBeGreaterThanOrEqual(720);
      expect(radioHandler.loopCounter).toBeLessThanOrEqual(2880);
    });

    test('should initialize active to false', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.active).toBe(false);
    });

    test('should initialize passWeather to true', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.passWeather).toBe(true);
    });

    test('should initialize parameterList with 11 mission entries', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.parameterList).toHaveLength(11);
    });

    test('should initialize okToReport to true', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.okToReport).toBe(true);
    });

    test('should initialize gotWeatherReport to false', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.gotWeatherReport).toBe(false);
    });

    test('should register for weather reports', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(mockGlobals.weather.reportWeatherToMe).toHaveBeenCalledWith(radioHandler);
    });

    test('should add to loopMaster', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(mockGlobals.loopMaster.addObject).toHaveBeenCalledWith(radioHandler);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear DialogList', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.kill();
      expect(radioHandler.DialogList).toBeNull();
    });

    test('should clear dialogStartList', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.kill();
      expect(radioHandler.dialogStartList).toBeNull();
    });

    test('should reset loopCounter', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.kill();
      expect(radioHandler.loopCounter).toBe(0);
    });

    test('should reset active', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.kill();
      expect(radioHandler.active).toBe(false);
    });

    test('should reset passWeather', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.kill();
      expect(radioHandler.passWeather).toBe(false);
    });

    test('should clear reportObject', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.reportObject = { test: true };
      radioHandler.kill();
      expect(radioHandler.reportObject).toBeNull();
    });

    test('should remove from loopMaster', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.kill();
      expect(mockGlobals.loopMaster.deleteObject).toHaveBeenCalledWith(radioHandler);
    });

    test('should return null', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const result = radioHandler.kill();
      expect(result).toBeNull();
    });
  });

  describe('startReportRadioToMe', () => {
    /**
     * Lingo: on startreportRadioToMe me, argObj, argPassWeather
     */
    test('should set reportObject', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      
      radioHandler.startReportRadioToMe(mockObj);
      
      expect(radioHandler.reportObject).toBe(mockObj);
    });

    test('should activate handler', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      
      radioHandler.startReportRadioToMe(mockObj);
      
      expect(radioHandler.active).toBe(true);
    });

    test('should set passWeather to true by default', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      radioHandler.passWeather = false;
      
      radioHandler.startReportRadioToMe(mockObj);
      
      expect(radioHandler.passWeather).toBe(true);
    });

    test('should allow disabling passWeather', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      
      radioHandler.startReportRadioToMe(mockObj, false);
      
      expect(radioHandler.passWeather).toBe(false);
    });

    test('should reset gotWeatherReport', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      radioHandler.gotWeatherReport = true;
      
      radioHandler.startReportRadioToMe(mockObj);
      
      expect(radioHandler.gotWeatherReport).toBe(false);
    });

    test('should not set invalid object', () => {
      radioHandler = new RadioHandler(mockGlobals);
      
      radioHandler.startReportRadioToMe(null);
      
      expect(radioHandler.reportObject).toBeNull();
      expect(radioHandler.active).toBe(false);
    });
  });

  describe('stopReportRadioToMe', () => {
    /**
     * Lingo: on stopReportRadioToMe me, argObj
     */
    test('should stop reporting to matching object', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj = { radioReport: jest.fn() };
      radioHandler.reportObject = mockObj;
      radioHandler.active = true;
      
      radioHandler.stopReportRadioToMe(mockObj);
      
      expect(radioHandler.active).toBe(false);
      expect(radioHandler.reportObject).toBeNull();
    });

    test('should not stop if object does not match', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockObj1 = { radioReport: jest.fn() };
      const mockObj2 = { radioReport: jest.fn() };
      radioHandler.reportObject = mockObj1;
      radioHandler.active = true;
      
      radioHandler.stopReportRadioToMe(mockObj2);
      
      expect(radioHandler.active).toBe(true);
      expect(radioHandler.reportObject).toBe(mockObj1);
    });
  });

  describe('setActive', () => {
    /**
     * Lingo: on setActive me, argStatus
     */
    test('should set active status', () => {
      radioHandler = new RadioHandler(mockGlobals);
      
      radioHandler.setActive(true);
      expect(radioHandler.active).toBe(true);
      
      radioHandler.setActive(false);
      expect(radioHandler.active).toBe(false);
    });
  });

  describe('getInDialogList', () => {
    /**
     * Lingo: on getInDialogList me, argID
     */
    test('should return index when ID found', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.DialogList = [
        { ID: 1, dialog: ['a'] },
        { ID: 5, dialog: ['b'] },
        { ID: 3, dialog: ['c'] }
      ];
      
      expect(radioHandler.getInDialogList(5)).toBe(2);
    });

    test('should return 0 when ID not found', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.DialogList = [
        { ID: 1, dialog: ['a'] }
      ];
      
      expect(radioHandler.getInDialogList(99)).toBe(0);
    });

    test('should return 0 for empty list', () => {
      radioHandler = new RadioHandler(mockGlobals);
      expect(radioHandler.getInDialogList(1)).toBe(0);
    });
  });

  describe('weatherReport', () => {
    /**
     * Lingo: on weatherReport me, argWeather
     */
    test('should create weather dialog when TimeLeft > 0', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      expect(radioHandler.DialogList.length).toBeGreaterThan(0);
      expect(radioHandler.gotWeatherReport).toBe(true);
    });

    test('should include start dialog', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      const dialog = radioHandler.DialogList[0];
      expect(radioHandler.dialogStartList).toContain(dialog.dialog[0]);
    });

    test('should include direction dialog', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      const dialog = radioHandler.DialogList[0];
      expect(dialog.dialog).toContain('00d042v0'); // West direction
    });

    test('should include speed dialog', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      const dialog = radioHandler.DialogList[0];
      expect(dialog.dialog).toContain('00d050v0'); // Speed 2
    });

    test('should include type dialog', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      const dialog = radioHandler.DialogList[0];
      expect(dialog.dialog).toContain('00d053v0'); // Type 1
    });

    test('should pass weather to reportObject when passWeather is true', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockReporter = { weatherReport: jest.fn() };
      radioHandler.reportObject = mockReporter;
      radioHandler.passWeather = true;
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      expect(mockReporter.weatherReport).toHaveBeenCalledWith(weather);
    });

    test('should not pass weather when passWeather is false', () => {
      radioHandler = new RadioHandler(mockGlobals);
      const mockReporter = { weatherReport: jest.fn() };
      radioHandler.reportObject = mockReporter;
      radioHandler.passWeather = false;
      const weather = { TimeLeft: 100, direction: 4, speed: 2, type: 1 };
      
      radioHandler.weatherReport(weather);
      
      expect(mockReporter.weatherReport).not.toHaveBeenCalled();
    });
  });

  describe('checkForNewDialog', () => {
    /**
     * Lingo: on checkForNewDialog me
     */
    test('should not add dialog when okToReport is false', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.okToReport = false;
      
      radioHandler.checkForNewDialog();
      
      expect(radioHandler.DialogList).toEqual([]);
    });

    test('should add dialog when level and mission conditions met', () => {
      mockGlobals.levelHandler.getLevel.mockReturnValue(1);
      mockGlobals.user.isMissionCompleted.mockReturnValue(false);
      mockGlobals.user.isMissionGiven.mockReturnValue(false);
      
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.checkForNewDialog();
      
      expect(radioHandler.DialogList.length).toBeGreaterThan(0);
    });

    test('should not add dialog when mission already given', () => {
      mockGlobals.levelHandler.getLevel.mockReturnValue(1);
      mockGlobals.user.isMissionGiven.mockReturnValue(true);
      
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.checkForNewDialog();
      
      expect(radioHandler.DialogList).toEqual([]);
    });
  });

  describe('loop', () => {
    /**
     * Lingo: on loop me
     */
    test('should decrement loopCounter when active', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.loopCounter = 100;
      
      radioHandler.loop();
      
      expect(radioHandler.loopCounter).toBe(99);
    });

    test('should not decrement when not active', () => {
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = false;
      radioHandler.loopCounter = 100;
      
      radioHandler.loop();
      
      expect(radioHandler.loopCounter).toBe(100);
    });

    test('should report dialog when counter reaches 0', () => {
      const mockReporter = { radioReport: jest.fn().mockReturnValue(true) };
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.loopCounter = 0;
      radioHandler.reportObject = mockReporter;
      radioHandler.DialogList = [{ ID: 1, dialog: ['test'], GiveMission: 20 }];
      
      radioHandler.loop();
      
      expect(mockReporter.radioReport).toHaveBeenCalled();
    });

    test('should give mission when dialog reported', () => {
      const mockReporter = { radioReport: jest.fn().mockReturnValue(true) };
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.loopCounter = 0;
      radioHandler.reportObject = mockReporter;
      radioHandler.DialogList = [{ ID: 1, dialog: ['test'], GiveMission: 20 }];
      
      radioHandler.loop();
      
      expect(mockGlobals.user.addGivenMission).toHaveBeenCalledWith(20);
    });

    test('should remove dialog from list after reporting', () => {
      const mockReporter = { radioReport: jest.fn().mockReturnValue(true) };
      // Make all missions already given to prevent checkForNewDialog adding new ones
      mockGlobals.user.isMissionGiven.mockReturnValue(true);
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.loopCounter = 0;
      radioHandler.reportObject = mockReporter;
      radioHandler.DialogList = [{ ID: 1, dialog: ['test'], GiveMission: 20 }];
      
      radioHandler.loop();
      
      expect(radioHandler.DialogList).toEqual([]);
    });

    test('should reset loopCounter after reporting', () => {
      const mockReporter = { radioReport: jest.fn().mockReturnValue(true) };
      radioHandler = new RadioHandler(mockGlobals);
      radioHandler.active = true;
      radioHandler.loopCounter = 0;
      radioHandler.reportObject = mockReporter;
      radioHandler.DialogList = [{ ID: 1, dialog: ['test'], GiveMission: 20 }];
      
      radioHandler.loop();
      
      expect(radioHandler.loopCounter).toBeGreaterThanOrEqual(720);
    });
  });
});
