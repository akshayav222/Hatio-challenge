import express from 'express';
import {
    addTodo,
    updateTodo,
    deleteTodo,
    markTodoAsCompleted,
    markTodoAsPending
} from '../controllers/todoController.js';

const router = express.Router();

router.post('/', addTodo);
router.put('/:todoId', updateTodo);
router.delete('/:todoId/:projectId', deleteTodo);
router.put('/:todoId/complete', markTodoAsCompleted);
router.put('/:todoId/pending', markTodoAsPending);

export default router;
