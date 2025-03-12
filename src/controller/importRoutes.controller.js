

export const importRoute = async (req, res) => {

    try {

        const route = await Route.create(req.body)

        return res.status(201).json({
            status: true,
            message: "Route imported successfully",
            data: route
        })
    }

    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error, please try again later"
        })
    }
}