import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    })
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch {
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, department } = req.body

    if (!firstName || !lastName || !email || !department) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await prisma.user.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        department: String(department).trim(),
      },
    })

    res.status(201).json(user)
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ message: 'A user with this email already exists' })
      return
    }

    res.status(500).json({ message: 'Failed to create user' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { firstName, lastName, email, department } = req.body

    if (!firstName || !lastName || !email || !department) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        department: String(department).trim(),
      },
    })

    res.json(user)
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ message: 'A user with this email already exists' })
      return
    }

    res.status(500).json({ message: 'Failed to update user' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.user.delete({ where: { id } })
    res.status(204).send()
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(500).json({ message: 'Failed to delete user' })
  }
})

export default router
