import { list } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const { blobs } = await list({ prefix: 'portfolio-twr-cache' })
    if (!blobs.length) return res.status(404).json({ error: 'No TWR cache found' })

    const response = await fetch(blobs[0].url)
    if (!response.ok) throw new Error('Failed to fetch blob')

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to load TWR data' })
  }
}
