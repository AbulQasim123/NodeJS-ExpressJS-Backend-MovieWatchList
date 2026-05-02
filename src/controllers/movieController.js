import { prisma } from "../config/db.js";

const createMovie = async (req, res) => {

    const { title, overview, genres, releaseYear, runtime, posterUrl, createdBy } = req.body;

    const movieExists = await prisma.movie.findFirst({
        where: { title: title },
    });

    if (movieExists) {
        return res
            .status(400)
            .json({ error: "Movie already exists with this title" });
    }

    const movie = await prisma.movie.create({
        data: {
            title,
            overview,
            genres,
            releaseYear,
            runtime,
            posterUrl,
            createdBy,
        },
    });

    res.status(200).json({
        status: "success",
        data: { movie },
    });
};

const updateMovie = async (req, res) => {
    const { id, title, overview, genres, releaseYear, runtime, posterUrl, createdBy } = req.body;

    const movie = await prisma.movie.findUnique({
        where: { id: id },
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    const updatedMovie = await prisma.movie.update({
        where: { id: id },
        data: {
            title,
            overview,
            genres,
            releaseYear,
            runtime,
            posterUrl,
            createdBy,
        },
    });

    res.status(200).json({
        status: "success",
        data: {
            movie: updatedMovie,
        },
    });
};


const getMovies = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await prisma.movie.findMany({
        take: limit,
        skip: skip,
    });

    const totalMovies = await prisma.movie.count();

    res.status(200).json({
        status: "success",
        data: {
            movies,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalMovies / limit),
                totalMovies,
            },
        },
    });
};

const deleteMovie = async (req, res) => {
    const { id } = req.body;

    const movie = await prisma.movie.findUnique({
        where: { id: id },
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    await prisma.movie.delete({
        where: { id: id },
    });

    res.status(200).json({
        status: "success",
        message: "Movie deleted successfully",
    });
};

export { createMovie, updateMovie, getMovies, deleteMovie };
