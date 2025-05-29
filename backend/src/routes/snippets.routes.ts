import { Router } from 'express'
import { SnippetsController } from '../controllers/snippets.controller'

const router = Router()
const snippetsController = new SnippetsController()

router.post('/snippets', (req, res) =>
  snippetsController.createSnippet(req, res)
)
router.get('/snippets/:id', (req, res) =>
  snippetsController.getSnippet(req, res)
)

export default router
