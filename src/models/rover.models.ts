import Camera from "./camera.models";

export default interface Rover {
    id: number,
    name: string,
    landing_date: string,
    launch_date: string,
    status: string,
    max_sol: number,
    max_date: string,
    total_photos: number,
    cameras: Camera[]
}