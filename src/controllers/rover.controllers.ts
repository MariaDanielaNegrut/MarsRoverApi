import axios from "axios";
import api_key from "../configs/config";
import {Request, Response} from "express";
import Rover from "../models/rover.models";
import RoverImage from "../models/image.models";
import moment, {Moment} from "moment";

export const getAllRovers = async (req: Request, res: Response) => {
    try {
        let resultData: Rover[];

        axios.get(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${api_key}`,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        ).then((response) => {
            if (response.status === 200) {
                resultData = response.data["rovers"].map((item: Rover) => {
                    return {
                        id: item.id,
                        name: item.name,
                        landing_date: item.landing_date,
                        launch_date: item.launch_date,
                        status: item.status,
                        max_sol: item.max_sol,
                        max_date: item.max_date,
                        total_photos: item.total_photos,
                        cameras: item.cameras.map((item_camera) => {
                            return {
                                id: item_camera.id,
                                name: item_camera.name,
                                full_name: item_camera.full_name
                            };
                        })
                    };
                })

                res.send(JSON.stringify({
                    "status": 200,
                    "data": resultData
                }, null, 2));
            }
        }).catch(function (error){
            if (error.response) {
                res.send(JSON.stringify({
                    "status": error.response.status,
                    "data": resultData
                }, null, 2));
            } else if (error.request) {
                res.send(JSON.stringify({
                    "status": 406,
                    "error": "An error occurred."
                }, null, 2));
            } else {
                res.send(JSON.stringify({
                    "status": 406,
                    "error": "An error occurred."
                }, null, 2));
            }
        });

    } catch (error) {
        res.send(JSON.stringify({
            "error": "An error occured." + error,
        }, null, 2));
    }
}

export const getRoverPhotos = async (req: Request, res: Response) => {
    try {
        const rover: string = req.params["roverName"];
        const camera_type: string = req.params["cameraType"];
        let start_date: Moment | null = null;
        let end_date: Moment | null = null;

        let resultData: RoverImage[] = [];

        if (req.query.start_date) {
            start_date = moment(req.query.start_date.toString());
            if (!start_date.isValid()) {
                res.send(JSON.stringify({
                    "status": 406,
                    "error": "Start date format invalid"
                }, null, 2));

                return;
            }
        }

        if (req.query.end_date) {
            end_date = moment(req.query.end_date.toString());
            if (!end_date.isValid()) {
                res.send(JSON.stringify({
                    "status": 406,
                    "error": "End date format invalid"
                }, null, 2));

                return;
            }
        }

        if (start_date === null && end_date === null) {
            axios.get(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&camera=${camera_type}&api_key=${api_key}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            ).then((response) => {
                if (response.status === 200) {
                    resultData = response.data["photos"].map((item: RoverImage) => {
                        return {
                            id: item.id,
                            sol: item.sol,
                            camera: {
                                id: item.camera.id,
                                name: item.camera.name,
                                full_name: item.camera.full_name
                            },
                            img_src: item.img_src,
                            earth_date: item.earth_date
                        };
                    })

                    res.send(JSON.stringify({
                        "status": 200,
                        "data": resultData
                    }, null, 2));
                }
            }).catch(function (error) {
                if (error.response) {
                    res.send(JSON.stringify({
                        "status": error.response.status,
                        "data": resultData
                    }, null, 2));
                } else if (error.request) {
                    res.send(JSON.stringify({
                        "status": 406,
                        "error": "An error occurred."
                    }, null, 2));
                } else {
                    res.send(JSON.stringify({
                        "status": 406,
                        "error": "An error occurred."
                    },null, 2));
                }
            });
            return;
        }
        else if (start_date !== null && end_date !== null) {
            for (var date: Moment = moment(start_date); date.diff(end_date, 'days') <= 0; date.add(1, 'days')) {
                axios.get(
                    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?camera=${camera_type}&api_key=${api_key}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        params: {
                            "earth_date": date.format("YYYY-MM-DD")
                        }
                    },
                ).then((response) => {
                    if (response.status === 200) {
                        resultData.push(response.data["photos"].map((item: RoverImage) => {
                            return {
                                id: item.id,
                                sol: item.sol,
                                camera: {
                                    id: item.camera.id,
                                    name: item.camera.name,
                                    full_name: item.camera.full_name
                                },
                                img_src: item.img_src,
                                earth_date: item.earth_date
                            };
                        }));

                        res.send(JSON.stringify({
                            "status": 200,
                            "data": resultData
                        }, null, 2));
                    }
                }).catch(function (error) {
                    if (error.response) {
                        res.send(JSON.stringify({
                            "status": error.response.status,
                            "data": resultData
                        }, null, 2));
                    } else if (error.request) {
                        res.send(JSON.stringify({
                            "status": 406,
                            "error": "An error occurred."
                        }, null, 2));
                    } else {
                        res.send(JSON.stringify({
                            "status": 406,
                            "error": "An error occurred."
                        },null, 2));
                    }
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({
            "error": "An error occured.",
            "message": error
        },null, 2));
    }
}