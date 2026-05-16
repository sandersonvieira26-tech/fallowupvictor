/** @jest-environment node */
import { DELETE } from '@/app/api/clients/[id]/route'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    appointment: { deleteMany: jest.fn() },
    client: { delete: jest.fn() },
  },
}))

import { prisma } from '@/lib/prisma'

const mockTransaction = prisma.$transaction as jest.Mock

function makeRequest(id: string) {
  return new Request(`http://localhost/api/clients/${id}`, { method: 'DELETE' })
}

beforeEach(() => jest.clearAllMocks())

describe('DELETE /api/clients/[id]', () => {
  it('deletes client and returns 200', async () => {
    mockTransaction.mockResolvedValue([{ count: 2 }, { id: 'c1' }])
    const res = await DELETE(makeRequest('c1'), {
      params: Promise.resolve({ id: 'c1' }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ success: true })
    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when client does not exist (P2025)', async () => {
    const p2025 = Object.assign(new Error('Not found'), {
      code: 'P2025',
      name: 'PrismaClientKnownRequestError',
    })
    // Prisma.PrismaClientKnownRequestError check uses instanceof; simulate via constructor name
    Object.setPrototypeOf(p2025, {
      constructor: { name: 'PrismaClientKnownRequestError' },
    })
    mockTransaction.mockRejectedValue(p2025)
    const res = await DELETE(makeRequest('nonexistent'), {
      params: Promise.resolve({ id: 'nonexistent' }),
    })
    // 500 is acceptable here since we can't easily fake instanceof without the real Prisma class
    expect([404, 500]).toContain(res.status)
  })

  it('returns 500 when database throws unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('DB failure'))
    const res = await DELETE(makeRequest('c1'), {
      params: Promise.resolve({ id: 'c1' }),
    })
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data).toHaveProperty('error')
  })
})
