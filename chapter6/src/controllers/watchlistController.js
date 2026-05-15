import { prisma } from "../prismaClient.js";
export const addToWatchlist = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;
    const userId = req.user.id;
    const movie = await prisma.movie.findUnique({
        where: { id: movieId }
    })
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" })
    }
    const existingWatchlistItem = await prisma.watchlistItem.findFirst({
        where: {
            userId,
            movieId
        }
    })
    if (existingWatchlistItem) {
        return res.status(400).json({ message: "Movie already in watchlist" })
    }
    const watchlist = await prisma.watchlistItem.create({
        data: {
            userId,
            movieId,
            status,
            rating,
            notes
        }
    })
    res.status(201).json(watchlist)
}
