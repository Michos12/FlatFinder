import { Flat } from "../models/flat.model.js";

export async function getAllFlatsService() {
    const flats = await Flat.find();
    return flats;
}

export async function updateFlatService(flatData, flatId) {
    const updatedFlat = await Flat.findByIdAndUpdate(flatId, flatData, {
        new: true,
        runValidators: true
    });
    return updatedFlat;
}

export async function deleteFlatService(flatId) {
    const deletedFlat = await Flat.findByIdAndDelete(flatId);
    return deletedFlat;
}

export async function addFlatService(flatData) {
    const newFlat = new Flat(flatData);
    await newFlat.save();
    return newFlat;
}

export async function getFlatByIdService(flatId) {
    const flat = await Flat.findById(flatId);
    return flat;
}