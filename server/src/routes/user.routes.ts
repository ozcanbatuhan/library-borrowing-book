import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// get all user
router.get('/', userController.getAllUsers);

// get user by id
router.get('/:id', userController.getUserById);

// create new user
router.post('/', userController.createUser);

// update user
router.put('/:id', userController.updateUser);

// delete user
router.delete('/:id', userController.deleteUser);

// get user's borrowed book history
router.get('/:id/borrowings', userController.getUserBorrowings);

export default router; 