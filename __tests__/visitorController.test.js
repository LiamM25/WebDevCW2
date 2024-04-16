const visitorController = require('../controllers/visitorController.js');
const auth = require('../authentication/auth.js');
const UserDAO = require('../models/userModel');

describe('Visitor Controller', () => {
  describe('showLogin', () => {
    it('should render the login page', () => {
      const res = {
        render: jest.fn()
      };
      visitorController.showLogin({}, res);
      expect(res.render).toHaveBeenCalledWith('visitor/login');
    });
  });

  describe('showRegisterPage', () => {
    it('should render the registration page', () => {
      const res = {
        render: jest.fn()
      };
      visitorController.showRegisterPage({}, res);
      expect(res.render).toHaveBeenCalledWith('visitor/register');
    });
  });

  describe('showContactPage', () => {
    it('should render the contact page', () => {
      const res = {
        render: jest.fn()
      };
      visitorController.showContactPage({}, res);
      expect(res.render).toHaveBeenCalledWith('visitor/contact');
    });
  });

  describe('postLogin', () => {
    it('should redirect to user home page if user role is user', () => {
      const req = {
        userRole: 'user'
      };
      const res = {
        redirect: jest.fn()
      };
      auth.login = jest.fn((req, res, callback) => callback());
      visitorController.postLogin(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/user/home');
    });


  });

  describe('postNewUser', () => {
    it('should create a new user and redirect to login page', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        redirect: jest.fn()
      };
      UserDAO.lookup = jest.fn((email, callback) => callback(null, null));
      UserDAO.create = jest.fn((firstName, lastName, email, password, role, callback) => callback(null));
      visitorController.postNewUser(req, res);
      expect(UserDAO.lookup).toHaveBeenCalledWith(req.body.email, expect.any(Function));
      expect(UserDAO.create).toHaveBeenCalledWith(req.body.firstName, req.body.lastName, req.body.email, req.body.password, 'user', expect.any(Function));
      expect(res.redirect).toHaveBeenCalledWith('/visitor/login');
    });
  });
});
