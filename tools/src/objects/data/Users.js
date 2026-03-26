/**
 * @fileoverview Users - User account management
 * Based on: ParentScript 9 - Users.ls
 * 
 * Users manages the list of user accounts, including login,
 * creation, and deletion of user profiles.
 */

/**
 * Users class - manages user accounts
 * 
 * Lingo properties:
 *   users, maximumUsers
 */
class Users {
  /**
   * Create a new Users manager
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;
    
    // List of user IDs
    // Lingo: set users to []
    this.users = [];
    
    // Maximum number of users allowed
    // Lingo: set maximumUsers to 6
    this.maximumUsers = 6;
  }

  /**
   * Clean up
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.users = null;
    return null;
  }

  /**
   * Get number of users
   * Lingo: on nrOfUsers me
   * 
   * @returns {number} Number of users
   */
  nrOfUsers() {
    return this.users.length;
  }

  /**
   * Get list of usernames
   * Lingo: on getUsers me
   * 
   * @returns {Array} List of username strings
   */
  getUsers() {
    const names = [];
    for (const userId of this.users) {
      const userInfo = this._getUserInfo(userId);
      if (userInfo && userInfo.userName) {
        names.push(userInfo.userName);
      }
    }
    return names;
  }

  /**
   * Login with username (creates new user if needed)
   * Lingo: on login me, argUserName
   * 
   * @param {string} userName - Username to login
   * @returns {string} 'Ok' on success, 'error' on failure
   */
  login(userName) {
    // Check if user exists
    for (const userId of this.users) {
      const userInfo = this._getUserInfo(userId);
      if (userInfo && userInfo.userName === userName) {
        // Found existing user - load their data
        this.globals.user.fromList(userInfo);
        return 'Ok';
      }
    }
    
    // User not found - create new one
    if (this.nrOfUsers() >= this.maximumUsers) {
      return 'error';
    }
    
    return this._createNewUser(userName);
  }

  /**
   * Get user ID by username
   * Lingo: on getUserId me, argUserName
   * 
   * @param {string} userName - Username to find
   * @returns {number|string} User ID or 'NotFound'
   */
  getUserId(userName) {
    for (const userId of this.users) {
      const userInfo = this._getUserInfo(userId);
      if (userInfo && userInfo.userName === userName) {
        return userId;
      }
    }
    return 'NotFound';
  }

  /**
   * Delete a user by username
   * Lingo: on deleteUser me, argUserName
   * 
   * @param {string} userName - Username to delete
   * @returns {string} 'Ok' on success, 'NotFound' on failure
   */
  deleteUser(userName) {
    const userId = this.getUserId(userName);
    
    if (userId === 'NotFound') {
      return 'NotFound';
    }
    
    // Try to erase the user's data member
    if (this._eraseUserMember(userId)) {
      // Remove from users list
      const idx = this.users.indexOf(userId);
      if (idx >= 0) {
        this.users.splice(idx, 1);
      }
      return 'Ok';
    }
    
    return 'NotFound';
  }

  /**
   * Convert to list for saving
   * Lingo: on toList me
   * 
   * @returns {Array} Users array
   */
  toList() {
    return this.users;
  }

  /**
   * Load from list
   * Lingo: on fromList me, objectList
   * 
   * @param {Array} objectList - Users array to load
   */
  fromList(objectList) {
    this.users = objectList;
  }

  /**
   * Find the next available user ID
   * @private
   * 
   * @returns {number} Next available ID
   */
  _findNextAvailableId() {
    for (let id = 1; id <= this.maximumUsers; id++) {
      if (!this.users.includes(id)) {
        return id;
      }
    }
    return this.users.length + 1;
  }

  /**
   * Create a new user
   * @private
   * 
   * @param {string} userName - Username for new user
   * @returns {string} 'Ok' on success, 'error' on failure
   */
  _createNewUser(userName) {
    const newUserId = this._findNextAvailableId();
    
    // In real implementation:
    // - Copy template member
    // - Create new User object
    // - Initialize junk
    // - Save to member
    
    // Add to users list
    this.users.push(newUserId);
    
    return 'Ok';
  }

  /**
   * Get user info from database (stub)
   * @private
   * 
   * @param {number} userId - User ID
   * @returns {Object|null} User info object
   */
  _getUserInfo(userId) {
    // Would read from member "User{userId}DB"
    return null;
  }

  /**
   * Erase user member (stub)
   * @private
   * 
   * @param {number} userId - User ID
   * @returns {boolean} True if successful
   */
  _eraseUserMember(userId) {
    // Would erase member "User{userId}DB"
    return true;
  }
}

module.exports = Users;
