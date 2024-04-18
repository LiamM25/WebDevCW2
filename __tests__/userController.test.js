const userController = require('../controllers/userController.js');
const UserDAO = require('../models/userModel');
const InvDAO = require('../models/inventoryModel');

describe('User Controller', () => {
  describe('checkUserSession', () => {
    it('should call next if user session is valid', () => {
      const req = {
        user: { userId: '123' }
      };
      const res = {
        redirect: jest.fn()
      };
      const next = jest.fn();
      userController.checkUserSession(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should redirect to homepage if user session is invalid', () => {
      const req = {
        user: null
      };
      const res = {
        redirect: jest.fn()
      };
      const next = jest.fn();
      userController.checkUserSession(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('showHomePage', () => {
    it('should render the home page with user information', () => {
      const req = {
        user: { userId: '123', username: 'testuser' }
      };
      const res = {
        render: jest.fn()
      };
      userController.showHomePage(req, res);
      expect(res.render).toHaveBeenCalledWith('user/home', { user: req.user });
    });
  });



  describe('renderUserDonatePage', () => {
    it('should render the user donate page with user information', () => {
      const req = {
        user: { userId: '123', username: 'testuser' }
      };
      const res = {
        render: jest.fn()
      };
      userController.renderUserDonatePage(req, res);
      expect(res.render).toHaveBeenCalledWith('user/userDonate', { user: req.user });
    });
  });



});
