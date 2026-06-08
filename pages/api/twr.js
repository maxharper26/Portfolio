import { list } from '@vercel/blob'

let cache = null
let cacheTime = 0
const TTL = 24 * 60 * 60 * 1000 // 24 hours

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  if (cache && Date.now() - cacheTime < TTL) {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    return res.status(200).json(cache)
  }

  try {
    const { blobs } = await list({ prefix: 'portfolio-twr-cache' })
    if (!blobs.length) return res.status(404).json({ error: 'No TWR cache found' })

    const response = await fetch(blobs[0].url)
    if (!response.ok) throw new Error('Failed to fetch blob')

    const data = await response.json()
    cache = data
    cacheTime = Date.now()

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to load TWR data' })
  }
}
