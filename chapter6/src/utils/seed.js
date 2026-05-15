import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const seed = async () => {
    try {
        console.log("Seeding movies...")

        // Fetch a user to associate the movies with
        let user = await prisma.user.findFirst()

        if (!user) {
            console.log("No user found. Creating a default seed user...")
            // We should use a real bcrypt hash if possible, but for seeding it might be okay
            user = await prisma.user.create({
                data: {
                    name: "Seed User",
                    email: "seed@example.com",
                    password: "hashedpassword123"
                }
            })
        }

        const userId = user.id
        console.log(`Associating movies with user: ${user.name} (${userId})`)

        const movies = [
            {
                title: "The Matrix",
                overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                releaseYear: 1999,
                genres: ["Action", "Sci-Fi"],
                runtime: 136,
                posterUrl: "https://example.com/matrix.jpg",
                createdBy: userId
            },
            {
                title: "The Godfather",
                overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                releaseYear: 1972,
                genres: ["Crime", "Drama"],
                runtime: 175,
                posterUrl: "https://example.com/godfather.jpg",
                createdBy: userId
            },
            {
                title: "The Dark Knight",
                overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                releaseYear: 2008,
                genres: ["Action", "Crime", "Drama"],
                runtime: 152,
                posterUrl: "https://example.com/darkknight.jpg",
                createdBy: userId
            },
            {
                title: "Pulp Fiction",
                overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                releaseYear: 1994,
                genres: ["Crime", "Drama"],
                runtime: 154,
                posterUrl: "https://example.com/pulpfiction.jpg",
                createdBy: userId
            },
            {
                title: "Forrest Gump",
                overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with a low IQ.",
                releaseYear: 1994,
                genres: ["Drama", "Romance"],
                runtime: 142,
                posterUrl: "https://example.com/forrestgump.jpg",
                createdBy: userId
            }
        ]

        for (const movie of movies) {
            await prisma.movie.create({
                data: movie
            })
            console.log(`Movie ${movie.title} seeded successfully`)
        }
        console.log("All movies seeded successfully")
    } catch (error) {
        console.error("Error during seeding:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

seed()
