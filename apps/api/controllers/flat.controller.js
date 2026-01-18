import { 
    getAllFlatsService,
    updateFlatService,
    deleteFlatService,
    addFlatService,
    getFlatByIdService
} from "../services/flat.service.js";

export async function addFlat(req, res) {
    try {
        const flatData = { ...req.body, ownerId: req.user.id };
        const newFlat = await addFlatService(flatData);
        return res.status(201).json({
            success: true,
            message: "Flat Created Successfully",
            data: newFlat
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function getAllFlats(req, res) {
    try {
        const flats = await getAllFlatsService();

        if(!flats){
            return res.status(404).json({ message: 'Flats not found' });
        }

        return res.status(200).json({
            success: true,
            message: "Flats Found Successfully",
            data: flats
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function getFlatById(req, res) {
    try {
        const flatId = req.params.id;
        const flat = await getFlatByIdService(flatId);

        if(!flat){
            return res.status(404).json({ message: 'Flat is not found' });
        }

        return res.status(200).json({
            success: true,
            message: "Flat Found Successfully",
            data: flat
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function updateFlat(req, res) {
    try {
        const flatId = req.params.id;
        const flat = await getFlatByIdService(flatId);

        if(!flat){
            return res.status(404).json({ message: 'Flat is not found' });
        }

        if (!flat.ownerId.equals(req.user.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedFlat = await updateFlatService(req.body, flatId)

        return res.status(200).json({
            success: true,
            message: "Flat Updated Successfully",
            data: updatedFlat
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function deleteFlat(req, res) {
    try {
        const flatId = req.params.id;
        const flat = await getFlatByIdService(flatId);

        if(!flat){
            return res.status(404).json({ message: 'Flat is not found' });
        }

        if (!flat.ownerId.equals(req.user.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const deletedFlat = await deleteFlatService(flatId);

        return res.status(200).json({
            success: true,
            message: "Flat Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}