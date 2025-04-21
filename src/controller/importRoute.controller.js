import { Route } from "../model/routeCentre.model.js"

export const importRoute = async (req, res) => {

    try {

        req.body.userId = req.user._id

        const route = await Route.create(req.body)

        return res.status(201).json({
            status: true,
            message: "Route imported successfully",
            notificationMessage: "A new route has been added, Please check the route. You can use this route.",
            data: route
        })
    }

    catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}