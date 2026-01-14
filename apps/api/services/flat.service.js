import { Flat } from "../models/flat.model";

export async function getAllFlatsService() {
    const flats = await Flat.find();
    return flats;
}

export async function updateFlatService(data, id) {
    const updatedFlat = await Flat.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
    return updatedFlat;
}

export async function deleteFlatService(id) {
    const deletedFlat = await Flat.findByIdAndDelete(id);
    return deletedFlat;
}

export async function addFlatService(data) {
    const newFlat = new Flat(data);
    await newFlat.save();
    return newFlat;
}

export async function getFlatByIdService(id) {
    const flat = await Flat.findById(id);
    return flat;
}