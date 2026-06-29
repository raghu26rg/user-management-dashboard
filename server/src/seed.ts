import prisma from './lib/prisma.js'

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya',
  'James', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'Daniel', 'Ashley',
  'Chris', 'Megan', 'Ryan', 'Lauren', 'Kevin', 'Nina', 'Alex', 'Olivia',
  'Ethan', 'Sophia', 'Noah', 'Emma', 'Liam', 'Ava', 'Mason', 'Isabella',
]

const LAST_NAMES = [
  'Sharma', 'Patel', 'Singh', 'Gupta', 'Reddy', 'Iyer', 'Khan', 'Nair',
  'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
]

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Design',
  'Operations',
  'Customer Support',
  'Product',
  'Legal',
  'IT',
  'Research',
]

interface JsonPlaceholderUser {
  id: number
  name: string
  email: string
  company: { name: string }
}

function parseName(fullName: string) {
  const trimmed = fullName.trim()
  const spaceIndex = trimmed.indexOf(' ')

  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' }
  }

  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  }
}

async function fetchJsonPlaceholderUsers(): Promise<JsonPlaceholderUser[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')

  if (!response.ok) {
    throw new Error('Failed to fetch users from JSONPlaceholder')
  }

  return response.json() as Promise<JsonPlaceholderUser[]>
}

function buildSeedUsers(apiUsers: JsonPlaceholderUser[], targetCount = 60) {
  const users = apiUsers.map((user) => {
    const { firstName, lastName } = parseName(user.name)

    return {
      firstName,
      lastName,
      email: user.email,
      department: user.company.name,
    }
  })

  let index = 0

  while (users.length < targetCount) {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
    const lastName = LAST_NAMES[Math.floor(index / 2) % LAST_NAMES.length]
    const department = DEPARTMENTS[index % DEPARTMENTS.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${users.length + 1}@tacnique-demo.com`

    users.push({ firstName, lastName, email, department })
    index += 1
  }

  return users
}

export async function seedDatabase() {
  const count = await prisma.user.count()

  if (count > 0) {
    console.log(`Database already has ${count} users. Skipping seed.`)
    return count
  }

  const apiUsers = await fetchJsonPlaceholderUsers()
  const seedUsers = buildSeedUsers(apiUsers, 60)

  await prisma.user.createMany({ data: seedUsers })

  console.log(`Seeded ${seedUsers.length} users into the database.`)
  return seedUsers.length
}
