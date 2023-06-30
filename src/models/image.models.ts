import Camera from "./camera.models";

export default interface RoverImage {
    id: number,
    sol: number,
    camera: Camera,
    img_src: string,
    earth_date: string
};