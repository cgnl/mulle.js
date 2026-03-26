/**
 * @fileoverview Tests for Users - User account management
 * Based on: ParentScript 9 - Users.ls
 * 
 * Users manages the list of user accounts, including login,
 * creation, and deletion of user profiles.
 */

const Users = require('../Users');

describe('Users', () => {
  let users;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      user: {
        kill: jest.fn().mockReturnValue(null),
        fromList: jest.fn(),
        toList: jest.fn().mockReturnValue({}),
        setUserId: jest.fn(),
        setUserName: jest.fn(),
        initJunk: jest.fn()
      }
    };
  });

  afterEach(() => {
    if (users) {
      users.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize users as empty array', () => {
      users = new Users(mockGlobals);
      expect(users.users).toEqual([]);
    });

    test('should set maximumUsers to 6', () => {
      users = new Users(mockGlobals);
      expect(users.maximumUsers).toBe(6);
    });

    test('should return this', () => {
      users = new Users(mockGlobals);
      expect(users).toBeInstanceOf(Users);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear users array', () => {
      users = new Users(mockGlobals);
      users.kill();
      expect(users.users).toBeNull();
    });

    test('should return null', () => {
      users = new Users(mockGlobals);
      const result = users.kill();
      expect(result).toBeNull();
    });
  });

  describe('nrOfUsers', () => {
    /**
     * Lingo: on nrOfUsers me
     */
    test('should return 0 for empty users list', () => {
      users = new Users(mockGlobals);
      expect(users.nrOfUsers()).toBe(0);
    });

    test('should return correct count of users', () => {
      users = new Users(mockGlobals);
      users.users = [1, 2, 3];
      expect(users.nrOfUsers()).toBe(3);
    });
  });

  describe('getUsers', () => {
    /**
     * Lingo: on getUsers me
     */
    test('should return empty array when no users', () => {
      users = new Users(mockGlobals);
      users._getUserInfo = jest.fn();
      expect(users.getUsers()).toEqual([]);
    });

    test('should return list of usernames', () => {
      users = new Users(mockGlobals);
      users.users = [1, 2];
      users._getUserInfo = jest.fn()
        .mockReturnValueOnce({ userName: 'Alice' })
        .mockReturnValueOnce({ userName: 'Bob' });
      
      expect(users.getUsers()).toEqual(['Alice', 'Bob']);
    });
  });

  describe('login', () => {
    /**
     * Lingo: on login me, argUserName
     */
    test('should login existing user', () => {
      users = new Users(mockGlobals);
      users.users = [1];
      users._getUserInfo = jest.fn().mockReturnValue({ userName: 'Alice', data: {} });
      
      const result = users.login('Alice');
      
      expect(result).toBe('Ok');
      expect(mockGlobals.user.fromList).toHaveBeenCalled();
    });

    test('should create new user when name not found', () => {
      users = new Users(mockGlobals);
      users.users = [];
      users._createNewUser = jest.fn().mockReturnValue('Ok');
      
      const result = users.login('NewUser');
      
      expect(users._createNewUser).toHaveBeenCalledWith('NewUser');
    });

    test('should return error when at maximum users', () => {
      users = new Users(mockGlobals);
      users.users = [1, 2, 3, 4, 5, 6];
      users._getUserInfo = jest.fn().mockReturnValue({ userName: 'Other' });
      
      const result = users.login('NewUser');
      
      expect(result).toBe('error');
    });
  });

  describe('getUserId', () => {
    /**
     * Lingo: on getUserId me, argUserName
     */
    test('should return user ID when found', () => {
      users = new Users(mockGlobals);
      users.users = [1, 3, 5];
      users._getUserInfo = jest.fn()
        .mockReturnValueOnce({ userName: 'Alice' })
        .mockReturnValueOnce({ userName: 'Bob' })
        .mockReturnValueOnce({ userName: 'Carol' });
      
      expect(users.getUserId('Bob')).toBe(3);
    });

    test('should return NotFound when user not found', () => {
      users = new Users(mockGlobals);
      users.users = [1];
      users._getUserInfo = jest.fn().mockReturnValue({ userName: 'Alice' });
      
      expect(users.getUserId('Unknown')).toBe('NotFound');
    });

    test('should return NotFound for empty users', () => {
      users = new Users(mockGlobals);
      expect(users.getUserId('Anyone')).toBe('NotFound');
    });
  });

  describe('deleteUser', () => {
    /**
     * Lingo: on deleteUser me, argUserName
     */
    test('should delete existing user', () => {
      users = new Users(mockGlobals);
      users.users = [1, 2, 3];
      users._getUserInfo = jest.fn()
        .mockReturnValueOnce({ userName: 'Alice' })
        .mockReturnValueOnce({ userName: 'Bob' })
        .mockReturnValueOnce({ userName: 'Carol' });
      users._eraseUserMember = jest.fn().mockReturnValue(true);
      
      const result = users.deleteUser('Bob');
      
      expect(result).toBe('Ok');
      expect(users.users).toEqual([1, 3]);
    });

    test('should return NotFound when user not found', () => {
      users = new Users(mockGlobals);
      users.users = [1];
      users._getUserInfo = jest.fn().mockReturnValue({ userName: 'Alice' });
      
      expect(users.deleteUser('Unknown')).toBe('NotFound');
    });

    test('should return NotFound when member erase fails', () => {
      users = new Users(mockGlobals);
      users.users = [1];
      users._getUserInfo = jest.fn().mockReturnValue({ userName: 'Alice' });
      users._eraseUserMember = jest.fn().mockReturnValue(false);
      
      expect(users.deleteUser('Alice')).toBe('NotFound');
    });
  });

  describe('toList', () => {
    /**
     * Lingo: on toList me
     */
    test('should return users array', () => {
      users = new Users(mockGlobals);
      users.users = [1, 3, 5];
      expect(users.toList()).toEqual([1, 3, 5]);
    });
  });

  describe('fromList', () => {
    /**
     * Lingo: on fromList me, objectList
     */
    test('should set users from list', () => {
      users = new Users(mockGlobals);
      users.fromList([2, 4, 6]);
      expect(users.users).toEqual([2, 4, 6]);
    });
  });

  describe('_findNextAvailableId', () => {
    test('should return 1 for empty users', () => {
      users = new Users(mockGlobals);
      expect(users._findNextAvailableId()).toBe(1);
    });

    test('should find gap in user IDs', () => {
      users = new Users(mockGlobals);
      users.users = [1, 3];
      expect(users._findNextAvailableId()).toBe(2);
    });

    test('should return next after max when no gaps', () => {
      users = new Users(mockGlobals);
      users.users = [1, 2, 3];
      expect(users._findNextAvailableId()).toBe(4);
    });
  });
});
